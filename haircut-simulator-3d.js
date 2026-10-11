(() => {
  'use strict';
  const GAME = window.THE_CRAFT_SIM_3D;
  if (!GAME) return;

  const $ = id => document.getElementById(id);
  const canvas = $('barber-canvas'), gl = canvas.getContext('webgl', { alpha:true, antialias:true, depth:true, powerPreference:'low-power' });
  const HEAD = [0, .14, 0], BASE = { rx:.65, ry:.94, rz:.74 }, MAX_PHI=2.7, GRID_THETA=192, GRID_PHI=96;
  const PI=Math.PI, TAU=PI*2;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};
  const mix=(a,b,t)=>a+(b-a)*t;
  const vec=(x=0,y=0,z=0)=>[x,y,z];
  const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
  const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
  const mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const norm=a=>{const n=Math.hypot(a[0],a[1],a[2])||1;return [a[0]/n,a[1]/n,a[2]/n];};
  const hexColor=h=>{const s=h.replace('#','');return [parseInt(s.slice(0,2),16)/255,parseInt(s.slice(2,4),16)/255,parseInt(s.slice(4,6),16)/255];};

  const vertexSource = `
    attribute vec3 aPosition; attribute vec3 aNormal; attribute vec2 aUV; attribute vec3 aColor;
    uniform mat4 uMVP; uniform mat4 uModel; uniform float uPointSize;
    varying vec3 vNormal; varying vec3 vWorld; varying vec2 vUV; varying vec3 vColor;
    void main(){ vec4 world=uModel*vec4(aPosition,1.0); vWorld=world.xyz; vNormal=normalize(mat3(uModel)*aNormal); vUV=aUV; vColor=aColor; gl_Position=uMVP*vec4(aPosition,1.0); gl_PointSize=uPointSize; }
  `;
  const fragmentSource = `
    precision mediump float;
    uniform vec3 uColor; uniform float uMaterial; uniform vec3 uEye; uniform float uUseVertexColor;
    uniform float uReferenceBlend; uniform float uHairReferenceBlend; uniform vec3 uReferenceReady;
    uniform sampler2D uSkinFront; uniform sampler2D uSkinSide; uniform sampler2D uSkinBack;
    varying vec3 vNormal; varying vec3 vWorld; varying vec2 vUV; varying vec3 vColor;
    float skinMask(vec3 c){float rg=c.r-c.g,gb=c.g-c.b;return smoothstep(0.075,0.17,rg)*smoothstep(0.025,0.095,gb)*smoothstep(0.13,0.28,c.r);}
    float hairMask(vec3 c){float l=dot(c,vec3(.299,.587,.114));return (1.0-smoothstep(.20,.34,l))*(1.0-skinMask(c));}
    float beardMask(vec3 c,float y){float l=dot(c,vec3(.299,.587,.114));float faceBand=smoothstep(-.76,-.48,y)*(1.0-smoothstep(.04,.25,y));return faceBand*(1.0-smoothstep(.22,.42,l))*(1.0-skinMask(c));}
    float photoRegion(vec2 p,vec2 xBounds,vec2 yBounds){return smoothstep(xBounds.x,xBounds.x+.075,p.x)*(1.0-smoothstep(xBounds.y-.075,xBounds.y,p.x))*smoothstep(yBounds.x,yBounds.x+.07,p.y)*(1.0-smoothstep(yBounds.y-.07,yBounds.y,p.y));}
    float hash2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float hash3(vec3 p){return fract(sin(dot(p,vec3(.1271,.3117,.0747)))*43758.5453);}
    float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);float a=hash3(i),b=hash3(i+vec3(1,0,0)),c=hash3(i+vec3(0,1,0)),d=hash3(i+vec3(1,1,0)),e=hash3(i+vec3(0,0,1)),g=hash3(i+vec3(1,0,1)),h=hash3(i+vec3(0,1,1)),j=hash3(i+vec3(1,1,1));return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(h,j,f.x),f.y),f.z);}
    float curlPattern(vec2 uv){vec2 p=uv*vec2(68.0,30.0),cell=floor(p),f=fract(p);float h=hash2(cell);vec2 center=vec2(.5)+.16*vec2(cos(h*6.28318),sin(h*6.28318));vec2 d=f-center;float radius=length(d),angle=atan(d.y,d.x);return .5+.5*sin(radius*40.0-angle*1.65+h*6.28318);}
    float sidePhotoX(float a){if(a<.31)return 1.0-.23*(a/.31);if(a<1.57)return .77-.25*((a-.31)/1.26);return .52-.52*((a-1.57)/1.57);}
    float portraitV(float y){float face=.26+(y+.42)*.36;float neck=.10+(y+1.05)*.25;float top=.54+(y-.35)*.53;float lower=mix(neck,face,smoothstep(-.47,-.37,y));return mix(lower,top,smoothstep(.30,.40,y));}
    void main(){
      vec3 N=normalize(vNormal), L=normalize(vec3(-0.45,0.82,0.62)), V=normalize(uEye-vWorld);
      vec3 F=normalize(vec3(0.62,0.18,-0.7)), R=normalize(vec3(0.4,0.1,0.9));
      float diffuse=max(dot(N,L),0.0), fill=max(dot(N,F),0.0), rim=pow(1.0-max(dot(N,V),0.0),2.0);
      float spec=pow(max(dot(reflect(-L,N),V),0.0),mix(68.0,96.0,uMaterial));
      vec3 base=mix(uColor,vColor,uUseVertexColor);
      float skinPhotoWeight=0.0, hairPhotoWeight=0.0;
      float surfaceTheta=vUV.x*6.2831853;
      // Blend portrait references over broad, stable angular ranges. The previous sharp
      // 45-degree seams exposed profile eyes/noses on the front-facing temples.
      float sideAngle=abs(atan(sin(surfaceTheta),cos(surfaceTheta)));
      float frontRegion=1.0-smoothstep(.72,.86,sideAngle);
      // The side portrait overlaps the forward cheek so its profile eye and nose land
      // on the same facial landmarks as the front portrait instead of disappearing at 45°.
      float sideRegion=smoothstep(.88,1.05,sideAngle)*(1.0-smoothstep(2.20,2.40,sideAngle));
      float backRegion=smoothstep(2.42,2.70,sideAngle);
      if(uReferenceBlend>0.5){
        // The frontal portrait is the 306×248 upper-left panel of the low-fade process sheet.
        float theta=surfaceTheta, phi=vUV.y*3.14159265;
        vec2 frontLocal=vec2(0.5+sin(theta)*0.34,portraitV(vWorld.y));
        vec2 frontUV=vec2(frontLocal.x*0.19921875,1.0-(1.0-frontLocal.y)*0.2421875);
        // Wrap side and rear portraits along the head mesh so landmarks stay attached when rotated.
        vec2 sideLocal=vec2(sidePhotoX(sideAngle),clamp(.63+(vWorld.y-.35)*.41,0.04,.96));
        vec2 sideUV=sideLocal;
        vec2 backLocal=vec2(0.5+0.5*sin(theta),portraitV(vWorld.y));
        vec2 backUV=backLocal;
        vec3 front=texture2D(uSkinFront,frontUV).rgb;
        vec3 side=texture2D(uSkinSide,sideUV).rgb;
        vec3 back=texture2D(uSkinBack,backUV).rgb;
        vec2 frontPhotoPoint=vec2(frontLocal.x,1.0-frontLocal.y);
        vec2 sidePhotoPoint=vec2(sideLocal.x,1.0-sideLocal.y);
        float frontBounds=photoRegion(frontPhotoPoint,vec2(.18,.82),vec2(.16,.96));
        float sideBounds=photoRegion(sidePhotoPoint,vec2(.34,.99),vec2(.10,.91));
        float backBounds=photoRegion(vec2(backLocal.x,1.0-backLocal.y),vec2(.14,.86),vec2(.15,.93));
        // Select a single projection by the dominant horizontal surface direction. The narrow
        // confidence band falls back to the sculpted skin instead of stacking two different faces.
        float frontFeature=photoRegion(frontPhotoPoint,vec2(.27,.73),vec2(.30,.80));
        float sideFeature=photoRegion(sidePhotoPoint,vec2(.62,.99),vec2(.28,.80));
        float sideFaceArea=photoRegion(sidePhotoPoint,vec2(.38,.995),vec2(.22,.82));
        float wf=frontRegion*uReferenceReady.x*max(frontFeature,max(skinMask(front),beardMask(front,vWorld.y)));
        float ws=sideRegion*uReferenceReady.y*photoRegion(sidePhotoPoint,vec2(.25,.995),vec2(.16,.86));
        float wb=backRegion*uReferenceReady.z*max(skinMask(back),beardMask(back,vWorld.y));
        wf*=frontBounds;ws*=sideBounds;wb*=backBounds;
        float total=wf+ws+wb;
        vec3 photo=(front*wf+side*ws+back*wb)/max(total,0.0001);
        skinPhotoWeight=clamp(total,0.0,1.0);
        base=mix(base,photo,skinPhotoWeight*0.98);
      }
      if(uHairReferenceBlend>0.5){
        float lengthCoverage=clamp((0.64-vColor.r)/0.535,0.0,1.0);
        float phi=vUV.y*2.7;
        vec2 frontLocal=vec2(0.5+sin(surfaceTheta)*0.34,portraitV(vWorld.y));
        vec2 frontUV=vec2(frontLocal.x*0.19921875,1.0-(1.0-frontLocal.y)*0.2421875);
        vec2 sideLocal=vec2(sidePhotoX(sideAngle),clamp(.63+(vWorld.y-.35)*.41,0.04,.96));
        vec2 backLocal=vec2(0.5+0.5*sin(surfaceTheta),portraitV(vWorld.y));
        vec3 front=texture2D(uSkinFront,frontUV).rgb;
        vec3 side=texture2D(uSkinSide,sideLocal).rgb;
        vec3 back=texture2D(uSkinBack,backLocal).rgb;
        float wf=frontRegion*uReferenceReady.x*hairMask(front);
        float ws=sideRegion*uReferenceReady.y*hairMask(side);
        float wb=backRegion*uReferenceReady.z*hairMask(back);
        float total=wf+ws+wb;
        vec3 photo=(front*wf+side*ws+back*wb)/max(total,0.0001);
        hairPhotoWeight=clamp(total,0.0,1.0)*lengthCoverage;
        base=mix(base,photo,hairPhotoWeight*0.82);
      }
      float wrap=max(0.0,(dot(N,L)+0.35)/1.35);
      float skinLight=mix(0.47+0.31*diffuse+0.13*fill+0.10*wrap+0.045*rim,0.88+0.11*diffuse+0.035*fill+0.035*rim,skinPhotoWeight);
      float hairLight=mix(0.34+0.58*diffuse+0.12*fill+0.07*rim,0.86+0.08*diffuse+0.04*fill+0.045*rim,hairPhotoWeight);
      vec3 c=base*(uMaterial<0.5?skinLight:hairLight);
      if(uMaterial>0.5&&uMaterial<1.5){
        vec3 hairP=vec3(vWorld.x+vWorld.z*.24,vWorld.y,vWorld.z-vWorld.x*.41);
        float strand=noise3(hairP*42.0),fine=noise3(hairP*188.0),curl=noise3(hairP*82.0);
        float flowAngle=atan(vWorld.x,vWorld.z),flowCoord=vWorld.y*3.4+flowAngle*.55+sin(flowAngle*2.0+vWorld.y*4.0)*.055;
        float directional=pow(max(0.0,cos(flowCoord*220.0+noise3(hairP*21.0)*3.2)),12.0);
        if(uUseVertexColor>0.5&&vColor.r>0.48){float grain=noise3(hairP*260.0);c*=0.98+0.05*(grain-.5)-0.05*smoothstep(.82,.98,grain);c+=vec3(0.07,0.05,0.035)*spec*0.12;}
        else {float detail=.92+.08*(1.0-hairPhotoWeight);c*=0.84+detail*(0.07*strand+0.05*fine+0.11*curl);c+=vec3(0.12,0.078,0.048)*pow(curl,7.0)*.24;c+=vec3(0.095,0.060,0.035)*directional*.25;c+=vec3(0.09,0.065,0.042)*spec*0.10;}
      } else if(uMaterial<0.5){
        float pores=noise3(vWorld*235.0),broad=noise3(vWorld*38.0);
        float beard=1.0-smoothstep(.35,.39,vColor.g),stubble=noise3(vWorld*155.0);
        float microRelief=1.0-skinPhotoWeight*0.72;
        c*=1.0+(pores-.5)*0.016+(broad-.5)*0.040+(noise3(vWorld*13.0)-.5)*0.024*microRelief;
        c*=1.0+beard*0.32*(stubble-.5);
        c+=vec3(0.11,0.062,0.042)*spec*mix(0.22,0.09,skinPhotoWeight)+vec3(0.13,0.065,0.046)*rim*0.035;
      }
      else if(uMaterial<2.5){ c+=vec3(0.23)*spec*0.7; }
      else {float weave=sin(vWorld.x*205.0+vWorld.y*19.0)*sin(vWorld.z*211.0-vWorld.y*17.0);c*=0.94+0.018*weave;c+=vec3(0.045)*spec*0.08;}
      gl_FragColor=vec4(c,1.0);
    }
  `;

  function compile(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader)||'Shader compilation failed');return shader;}
  function createProgram(){const p=gl.createProgram();gl.attachShader(p,compile(gl.VERTEX_SHADER,vertexSource));gl.attachShader(p,compile(gl.FRAGMENT_SHADER,fragmentSource));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||'WebGL link failed');return p;}

  const matIdentity=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
  function matMul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o;}
  function translate(x,y,z){const m=matIdentity();m[12]=x;m[13]=y;m[14]=z;return m;}
  function scaleMat(x,y,z){const m=matIdentity();m[0]=x;m[5]=y;m[10]=z;return m;}
  function rotateY(a){const c=Math.cos(a),s=Math.sin(a);return new Float32Array([c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]);}
  function rotateZ(a){const c=Math.cos(a),s=Math.sin(a);return new Float32Array([c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1]);}
  function perspective(fovy,aspect,near,far){const f=1/Math.tan(fovy/2),nf=1/(near-far),o=new Float32Array(16);o[0]=f/aspect;o[5]=f;o[10]=(far+near)*nf;o[11]=-1;o[14]=2*far*near*nf;return o;}
  function lookAt(eye,target,up=[0,1,0]){const z=norm(sub(eye,target)),x=norm(cross(up,z)),y=cross(z,x),o=matIdentity();o[0]=x[0];o[1]=y[0];o[2]=z[0];o[4]=x[1];o[5]=y[1];o[6]=z[1];o[8]=x[2];o[9]=y[2];o[10]=z[2];o[12]=-dot(x,eye);o[13]=-dot(y,eye);o[14]=-dot(z,eye);return o;}

  function meshFromArrays(positions,normals,uvs,indices,usage=gl.STATIC_DRAW,colors=null){
    const mesh={count:indices?.length||positions.length/3,indexed:Boolean(indices),buffers:{}};
    for(const [key,data,size] of [['position',positions,3],['normal',normals,3],['uv',uvs,2]]){mesh.buffers[key]=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,mesh.buffers[key]);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),usage);mesh[key+'Size']=size;}
    if(colors){mesh.buffers.color=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,mesh.buffers.color);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),usage);mesh.colorSize=3;}
    if(indices){mesh.buffers.index=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.buffers.index);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);}
    return mesh;
  }
  function sphereMesh(rows=24,cols=32){const p=[],n=[],uv=[],idx=[];for(let y=0;y<=rows;y++){const v=y/rows,phi=v*PI;for(let x=0;x<=cols;x++){const u=x/cols,theta=u*TAU,px=Math.sin(phi)*Math.sin(theta),py=Math.cos(phi),pz=Math.sin(phi)*Math.cos(theta);p.push(px,py,pz);n.push(px,py,pz);uv.push(u,v);if(y<rows&&x<cols){const a=y*(cols+1)+x,b=a+cols+1;idx.push(a,b,a+1,b,b+1,a+1);}}}return meshFromArrays(p,n,uv,idx);}
  function boxMesh(){const p=[],n=[],uv=[],idx=[];const faces=[[[0,0,1],[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]],[[0,0,-1],[.5,-.5,-.5],[-.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5]],[[1,0,0],[.5,-.5,.5],[.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5]],[[-1,0,0],[-.5,-.5,-.5],[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5]],[[0,1,0],[-.5,.5,.5],[.5,.5,.5],[.5,.5,-.5],[-.5,.5,-.5]],[[0,-1,0],[-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5],[-.5,-.5,.5]]];let base=0;for(const f of faces){for(let i=1;i<=4;i++){const q=f[i];p.push(...q);n.push(...f[0]);uv.push(i===1||i===4?0:1,i<3?0:1);}idx.push(base,base+1,base+2,base,base+2,base+3);base+=4;}return meshFromArrays(p,n,uv,idx);}
  function buildNeckMesh(){const rows=34,cols=64,p=[],n=[],uv=[],idx=[];for(let j=0;j<=rows;j++){const t=j/rows,y=-.56-.50*t,flare=clamp((t-.2)/.8,0,1),rx=.245+.072*flare-.012*Math.sin(t*PI),rz=.25+.042*t,centerZ=-.015-.022*t;for(let i=0;i<=cols;i++){const a=i/cols*TAU,s=Math.sin(a),c=Math.cos(a),front=Math.max(0,c);p.push(rx*s,y,centerZ+rz*c+.018*Math.exp(-Math.pow((t-.48)/.22,2))*front);n.push(...norm([s/rx,.12*Math.cos(t*PI),c/rz]));uv.push(i/cols,t);if(i<cols&&j<rows){const k=j*(cols+1)+i,b=k+cols+1;idx.push(k,k+1,b,k+1,b+1,b);}}}return meshFromArrays(p,n,uv,idx);}
  function buildBustMesh(){const rows=42,cols=96,p=[],n=[],uv=[],idx=[];for(let j=0;j<=rows;j++){const t=j/rows,y=-.49-1.14*t,shoulder=smooth(.04,.84,t),rx=.30+.69*shoulder,rz=.28+.31*shoulder;for(let i=0;i<=cols;i++){const a=i/cols*TAU,s=Math.sin(a),c=Math.cos(a),front=Math.max(0,c),fold=(.009*Math.sin(a*12+t*8)+.004*Math.sin(a*19-t*13))*smooth(.12,.72,t);p.push(rx*s,y,-.085+rz*c+fold*front);n.push(...norm([s/rx,.13*Math.cos(t*PI),c/rz]));uv.push(i/cols,t);if(i<cols&&j<rows){const k=j*(cols+1)+i,b=k+cols+1;idx.push(k,k+1,b,k+1,b+1,b);}}}return meshFromArrays(p,n,uv,idx);}
  let program, attrs={}, uniforms={}, sphere, box, neckMesh, bustMesh, hairMesh, skinMesh, hairFiberBuffer, clippingsMesh;
  let humanClientMesh=null,humanEyeMeshes=[],humanClientSource='';
  const skinTextures={front:null,side:null,back:null},skinReferenceReady=[0,0,0];
  try {
    if(!gl)throw new Error('WebGL context unavailable');
    program=createProgram();gl.useProgram(program);
    attrs={position:gl.getAttribLocation(program,'aPosition'),normal:gl.getAttribLocation(program,'aNormal'),uv:gl.getAttribLocation(program,'aUV'),color:gl.getAttribLocation(program,'aColor')};
    uniforms={mvp:gl.getUniformLocation(program,'uMVP'),model:gl.getUniformLocation(program,'uModel'),color:gl.getUniformLocation(program,'uColor'),material:gl.getUniformLocation(program,'uMaterial'),eye:gl.getUniformLocation(program,'uEye'),point:gl.getUniformLocation(program,'uPointSize'),useVertexColor:gl.getUniformLocation(program,'uUseVertexColor'),referenceBlend:gl.getUniformLocation(program,'uReferenceBlend'),hairReferenceBlend:gl.getUniformLocation(program,'uHairReferenceBlend'),referenceReady:gl.getUniformLocation(program,'uReferenceReady'),skinFront:gl.getUniformLocation(program,'uSkinFront'),skinSide:gl.getUniformLocation(program,'uSkinSide'),skinBack:gl.getUniformLocation(program,'uSkinBack')};
    gl.uniform1i(uniforms.skinFront,0);gl.uniform1i(uniforms.skinSide,1);gl.uniform1i(uniforms.skinBack,2);
    sphere=sphereMesh();box=boxMesh();neckMesh=buildNeckMesh();bustMesh=buildBustMesh();
  }
  catch(error){$('webgl-message').hidden=false;$('webgl-message').querySelector('span').textContent='The scene could not start: '+error.message;return;}

  function loadSkinReferences(){
    // The available photos are examples, not character UV maps. Keep valid neutral
    // placeholders bound and build this rotatable client entirely from geometry.
    for(const key of ['front','side','back']){const texture=gl.createTexture();skinTextures[key]=texture;gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([128,82,62,255]));for(const [name,value] of [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,name,value);}
  }

  const shapeFactors={oval:[1,1,1],round:[1.04,.96,1.04],square:[1.03,1,.99],oblong:[.94,1.08,.98],diamond:[.98,1.03,.96],heart:[1.04,1,.98]};
  let headShape='oval', headDims=[BASE.rx,BASE.ry,BASE.rz], hairField=new Float32Array(GRID_THETA*GRID_PHI), hairDirty=true,skinDirty=true;
  function updateHeadShape(shape){headShape=shape;const f=shapeFactors[shape]||shapeFactors.oval;headDims=[BASE.rx*f[0],BASE.ry*f[1],BASE.rz*f[2]];hairDirty=true;skinDirty=true;if(humanClientSource)buildMakeHumanClient(humanClientSource);scheduleRender();}
  function deleteMesh(mesh){if(!mesh?.buffers)return;for(const buffer of Object.values(mesh.buffers))if(buffer)gl.deleteBuffer(buffer);}
  function makeHumanPoint(x,y,z){
    const headWeight=smooth(5.05,6.3,y),shape=shapeFactors[headShape]||shapeFactors.oval;
    const sx=mix(.39,.70*shape[0],headWeight),sz=mix(.29,.69*shape[2],headWeight),centerZ=mix(.25,.58,headWeight);
    let py;if(y>=7.28)py=.35+(y-7.28)*.60;else if(y>=6.2)py=.35+(y-7.28)*1.02;else py=-.75+(y-6.2)*.62;
    py=HEAD[1]+(py-HEAD[1])*mix(1,shape[1],headWeight);
    return [x*sx,py,(z-centerZ)*sz];
  }
  function decodeAssetArray(base64,Type){const binary=atob(base64),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return new Type(bytes.buffer);}
  function buildMakeHumanClient(source){
    let vertices=[],groups={body:[],eyes:[]};
    if(typeof source==='string'){
      let group='';
      for(const raw of source.split(/\r?\n/)){
        if(raw.startsWith('v ')){const parts=raw.trim().split(/\s+/);vertices.push([Number(parts[1]),Number(parts[2]),Number(parts[3])]);continue;}
        if(raw.startsWith('g ')){group=raw.slice(2).trim();continue;}
        if(!raw.startsWith('f ')||(group!=='body'&&group!=='helper-l-eye'&&group!=='helper-r-eye'))continue;
        const ids=raw.slice(2).trim().split(/\s+/).map(part=>Number(part.split('/')[0])-1);if(ids.length<3||ids.some(i=>!Number.isInteger(i)||i<0||i>=vertices.length))continue;
        const target=group==='body'?groups.body:groups.eyes;
        for(let i=1;i<ids.length-1;i++){const tri=[ids[0],ids[i],ids[i+1]];if(group==='body'&&(vertices[tri[0]][1]+vertices[tri[1]][1]+vertices[tri[2]][1])/3<5.0)continue;target.push(tri);}
      }
    }else if(source?.vertices&&source?.bodyIndices&&source?.eyeIndices){
      const packed=decodeAssetArray(source.vertices,Float32Array),body=decodeAssetArray(source.bodyIndices,Uint16Array),eyes=decodeAssetArray(source.eyeIndices,Uint16Array);
      for(let i=0;i<packed.length;i+=3)vertices.push([packed[i],packed[i+1],packed[i+2]]);
      for(let i=0;i<body.length;i+=3)groups.body.push([body[i],body[i+1],body[i+2]]);
      for(let i=0;i<eyes.length;i+=3)groups.eyes.push([eyes[i],eyes[i+1],eyes[i+2]]);
    }
    if(!groups.body.length)return false;
    const positions=vertices.map(v=>makeHumanPoint(...v)),normals=Array.from({length:vertices.length},()=>[0,0,0]),indices=[];
    const addFaces=(faces,normalTarget)=>{for(const tri of faces){const a=positions[tri[0]],b=positions[tri[1]],c=positions[tri[2]],fn=cross(sub(b,a),sub(c,a));for(const index of tri)normalTarget[index]=add(normalTarget[index],fn);}};
    // The official mesh is consistently outward-wound. Preserve that winding;
    // radial sign checks flip valid concave areas such as the eye sockets and nose.
    addFaces(groups.body,normals);
    const packedNormals=normals.flatMap(norm),uvs=new Array(vertices.length*2).fill(0),flatPositions=positions.flat();
    const bodyIndices=groups.body.flat();
    const nextBody=meshFromArrays(flatPositions,packedNormals,uvs,bodyIndices,gl.STATIC_DRAW);
    const nextEyes=[];
    if(groups.eyes.length){const eyeNormals=Array.from({length:vertices.length},()=>[0,0,0]);addFaces(groups.eyes,eyeNormals);for(const side of [-1,1]){const subset=[];for(const tri of groups.eyes){const cx=(vertices[tri[0]][0]+vertices[tri[1]][0]+vertices[tri[2]][0])/3;if(Math.sign(cx)===side)subset.push(...tri);}if(subset.length)nextEyes.push(meshFromArrays(flatPositions,eyeNormals.flatMap(norm),uvs,subset,gl.STATIC_DRAW));}}
    deleteMesh(humanClientMesh);humanEyeMeshes.forEach(deleteMesh);humanClientMesh=nextBody;humanEyeMeshes=nextEyes;return true;
  }
  function loadMakeHumanClient(){
    const embedded=window.THE_CRAFT_HUMAN_CLIENT;if(embedded){humanClientSource=embedded;if(buildMakeHumanClient(embedded))scheduleRender();return;}
    fetch('assets/character/makehuman-base.obj',{cache:'force-cache'}).then(response=>{if(!response.ok)throw new Error('model asset unavailable');return response.text();}).then(source=>{humanClientSource=source;if(buildMakeHumanClient(source))scheduleRender();}).catch(()=>{humanClientSource='';});
  }
  function bilateralGaussian(theta,center,width){return .5*(Math.exp(-Math.pow((theta-center)/width,2))+Math.exp(-Math.pow((theta+center)/width,2)));}
  function headPoint(theta,phi){
    const [rx,ry,rz]=headDims,absTheta=Math.abs(wrapAngle(theta));
    let jaw=1;if(phi>1.12)jaw=1-.14*clamp((phi-1.12)/.9,0,1);if(headShape==='square'&&phi>1.12)jaw+=.045*Math.sin(clamp((phi-1.12)/.8,0,1)*PI);if(headShape==='heart'&&phi>1.1)jaw-=.11*clamp((phi-1.1)/.95,0,1);
    let cheek=1;if(headShape==='diamond')cheek+=.065*Math.sin(clamp((phi-.2)/2.6,0,1)*PI);
    const side=Math.sin(theta),front=Math.max(0,Math.cos(theta)),face=front**4;
    const cheekbone=.072*Math.exp(-Math.pow((phi-1.48)/.25,2))*bilateralGaussian(theta,.47,.28);
    const cheekPad=.038*Math.exp(-Math.pow((phi-1.67)/.29,2))*bilateralGaussian(theta,.38,.36);
    const temple=.026*Math.exp(-Math.pow((phi-1.12)/.24,2))*bilateralGaussian(theta,.91,.27);
    const occiput=.028*Math.exp(-Math.pow((phi-1.42)/.42,2))*Math.max(0,-Math.cos(theta));
    const chin=.09*Math.exp(-Math.pow((phi-2.18)/.24,2));
    const forehead=.008*Math.exp(-Math.pow((phi-.94)/.48,2));
    const brow=.035*Math.exp(-Math.pow((phi-1.24)/.115,2))*bilateralGaussian(theta,.43,.28);
    const socket=-.034*Math.exp(-Math.pow((phi-1.37)/.12,2))*bilateralGaussian(theta,.43,.19);
    // Keep the nose integrated with the face, but give its bridge and tip a broad,
    // rounded profile. The previous narrow, high-amplitude tip made a sharp wedge
    // in side view and exaggerated the overall face projection.
    const bridge=.095*Math.exp(-Math.pow(theta/.25,2))*Math.exp(-Math.pow((phi-1.48)/.34,2));
    const tip=.145*Math.exp(-Math.pow(theta/.27,2))*Math.exp(-Math.pow((phi-1.68)/.26,2));
    const alae=.040*bilateralGaussian(theta,.16,.10)*Math.exp(-Math.pow((phi-1.68)/.13,2));
    const nostrils=-.018*bilateralGaussian(theta,.10,.055)*Math.exp(-Math.pow((phi-1.765)/.05,2));
    const muzzle=.05*Math.exp(-Math.pow((phi-1.90)/.14,2))*Math.exp(-Math.pow(theta/.32,2));
    const upperLip=.026*Math.exp(-Math.pow((phi-1.92)/.055,2))*Math.exp(-Math.pow(theta/.29,2));
    const lowerLip=.028*Math.exp(-Math.pow((phi-1.98)/.065,2))*Math.exp(-Math.pow(theta/.25,2));
    const asym=.0025*Math.sin(theta*2+phi*3.1)*Math.sin(phi*1.6);
    const wave=.0007*Math.sin(theta*11+phi*8)*Math.sin(phi*12),width=jaw*cheek+cheekbone+cheekPad+temple+occiput;
    const earBulge=.115*Math.exp(-Math.pow((absTheta-1.54)/.15,2))*Math.exp(-Math.pow((phi-1.42)/.28,2));
    const earForward=.032*Math.exp(-Math.pow((absTheta-1.54)/.17,2))*Math.exp(-Math.pow((phi-1.42)/.26,2));
    return [HEAD[0]+rx*Math.sin(phi)*side*width+wave+asym+Math.sign(side)*earBulge,HEAD[1]+ry*Math.cos(phi),HEAD[2]+rz*Math.sin(phi)*Math.cos(theta)*width+wave+face*(forehead+brow+socket+bridge+tip+alae+nostrils+muzzle+upperLip+lowerLip+chin)+earForward];
  }
  function headNormal(theta,phi){const e=.0025,a=headPoint(theta+e,phi),b=headPoint(theta-e,phi),c=headPoint(theta,phi+e),d=headPoint(theta,phi-e),crossed=cross(sub(c,d),sub(a,b));if(Math.hypot(...crossed)<1e-7){const [rx,ry,rz]=headDims,p=headPoint(theta,phi);return norm([(p[0]-HEAD[0])/(rx*rx),(p[1]-HEAD[1])/(ry*ry),(p[2]-HEAD[2])/(rz*rz)]);}return norm(crossed);}
  function scalpNormal(theta,phi){return norm([Math.sin(phi)*Math.sin(theta)/headDims[0],Math.cos(phi)/headDims[1],Math.sin(phi)*Math.cos(theta)/headDims[2]]);}
  function surfacePoint(theta,phi,offset=.01){return add(headPoint(theta,phi),mul(headNormal(theta,phi),offset));}
  function hairline(theta){const a=Math.abs(wrapAngle(theta)),front=Math.max(0,Math.cos(theta)),back=smooth(1.85,2.8,a),templeRecession=.045*Math.exp(-Math.pow((a-.55)/.20,2))*front,sideburnExtension=.18*Math.exp(-Math.pow((a-.99)/.22,2)),sideLift=.32*Math.exp(-Math.pow((a-1.55)/.62,2)),frontLift=.06*Math.pow(front,4),edgeBreakup=(.004*Math.sin(theta*17)+.0025*Math.sin(theta*31+1.4))*front;return 1.08+.56*(1-front)+.32*back+templeRecession+sideburnExtension-sideLift-frontLift+.012*Math.sin(theta*4)+edgeBreakup;}
  function wrapAngle(a){while(a>PI)a-=TAU;while(a< -PI)a+=TAU;return a;}
  function regionAt(theta,phi){const a=Math.abs(wrapAngle(theta));if(phi<.55)return 'top';if(a>2.42&&phi<.94)return 'crown';if(a>2.45&&phi>1.72)return 'neckline';if(a>2.28)return 'back';if(a<.92&&phi>1.04)return a<.62?'temple':(wrapAngle(theta)<0?'leftTemple':'rightTemple');if(a>.78&&a<1.23&&phi>1.34&&phi<1.72)return wrapAngle(theta)<0?'leftSideburn':'rightSideburn';if(a>1.1&&a<2.08&&phi>1.42&&phi<1.78)return wrapAngle(theta)<0?'leftBehindEar':'rightBehindEar';if(a<1.12&&phi<.86)return 'top';if(a>2.5&&phi<1.15)return 'crown';return wrapAngle(theta)<0?'leftSide':'rightSide';}
  let clippings=[],clippingsDirty=true,mistEffect=null,combPath=[],clippingSeed=0;
  function initHair(length=GAME.initialHairLength){hairField.fill(length);hairDirty=true;clippings=[];clippingsDirty=true;mistEffect=null;combReady=false;combPath=[];clippingSeed=0;}
  function headDistance(a,b){return Math.hypot(wrapAngle(a.theta-b.theta)*Math.sin((a.phi+b.phi)/2),a.phi-b.phi);}
  function combInfluence(theta,phi){if(!combReady||!combPath.length)return 0;const point={theta,phi};let nearest=Infinity;for(const sample of combPath)nearest=Math.min(nearest,headDistance(point,sample));return clamp(1-nearest/.30,0,1);}
  function guidePhiAt(theta,basePhi){if(style.group==='drop')return basePhi+.23*(1-Math.cos(wrapAngle(theta)))/2;if(style.group==='burst')return basePhi+.075*Math.exp(-Math.pow((Math.abs(wrapAngle(theta))-1.52)/.42,2));return basePhi;}
  function sampleHair(theta,phi){let u=((theta/TAU)%1+1)%1*GRID_THETA,v=clamp(phi/MAX_PHI,0,1)*(GRID_PHI-1),x0=Math.floor(u)%GRID_THETA,x1=(x0+1)%GRID_THETA,y0=Math.floor(v),y1=Math.min(GRID_PHI-1,y0+1),fx=u-Math.floor(u),fy=v-y0;const a=mix(hairField[y0*GRID_THETA+x0],hairField[y0*GRID_THETA+x1],fx),b=mix(hairField[y1*GRID_THETA+x0],hairField[y1*GRID_THETA+x1],fx);return mix(a,b,fy);}
  function hairShellOffset(length){return .004+Math.max(0,length)*.0027;}
  function hairFiberHeight(length){return Math.min(.018,.002+Math.max(0,length)*.00036);}
  function hairSurfaceOffset(length,clearance=.002){return hairShellOffset(length)+.001+hairFiberHeight(length)+clearance;}

  function buildHairMesh(){const rows=64,cols=224,p=[],n=[],uv=[],colors=[],idx=[],scalp=[.57,.39,.31],hair=[.22,.145,.092];for(let j=0;j<=rows;j++){const v=j/rows;for(let i=0;i<=cols;i++){const theta=i/cols*TAU-PI,edge=hairline(theta),phi=v*edge,len=sampleHair(theta,phi),edgeFade=smooth(0,.072,edge-phi),normal=scalpNormal(theta,phi),base=headPoint(theta,phi),wisp=.0008*Math.sin(theta*77+phi*61);const lift=hairShellOffset(len*edgeFade)+wisp,coverage=smooth(.45,3.8,len)*edgeFade;p.push(base[0]+normal[0]*lift,base[1]+normal[1]*lift,base[2]+normal[2]*lift);n.push(...normal);uv.push(i/cols,phi/MAX_PHI);for(let k=0;k<3;k++)colors.push(mix(scalp[k],hair[k],coverage));if(i<cols&&j<rows){const a=j*(cols+1)+i,b=a+cols+1;idx.push(a,a+1,b,a+1,b+1,b);}}}if(!hairMesh){hairMesh=meshFromArrays(p,n,uv,idx,gl.DYNAMIC_DRAW,colors);}else{for(const [key,data] of [['position',p],['normal',n],['uv',uv],['color',colors]]){gl.bindBuffer(gl.ARRAY_BUFFER,hairMesh.buffers[key]);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.DYNAMIC_DRAW);}}buildHairFibers();hairDirty=false;}
  function fract(v){return v-Math.floor(v);}
  function buildHairFibers(){
    const p=[],n=[],uv=[],colors=[],count=7200,segments=3;
    for(let i=0;i<count;i++){
      const seed=fract((i+1)*.61803398875),theta=fract((i+1)*.754877666)*TAU,edge=Math.max(.08,hairline(theta)-.012),phi=Math.acos(mix(1,Math.cos(edge),seed)),length=sampleHair(theta,phi);
      if(length<.3||fract((i+1)*.569840291)>smooth(0,.072,hairline(theta)-phi))continue;
      const normal=scalpNormal(theta,phi),root=headPoint(theta,phi),tangentA=norm([Math.cos(theta),0,-Math.sin(theta)]),tangentB=norm(cross(normal,tangentA));
      // Short strands follow the scalp's growth direction. The old full-turn helix
      // made every head read like a knitted cap and produced a circular crown pattern.
      const combStrength=combInfluence(theta,phi),growth=phi<.98?tangentB:mul(tangentB,-1),crownWhorl=Math.exp(-Math.pow(phi/.48,2)),naturalFlow=norm(add(mul(growth,1-crownWhorl),mul(tangentA,crownWhorl))),combFlow=norm(add(mul(tangentA,combDirection[0]),mul(tangentB,combDirection[1]))),flow=combStrength?norm(add(mul(naturalFlow,1-combStrength),mul(combFlow,combStrength))):naturalFlow;
      const crossFlow=norm(cross(flow,normal)),variation=fract((i+1)*.38196601125),curlRadius=.0013+variation*.0030,height=hairFiberHeight(length),shellLift=hairShellOffset(length),phase=fract((i+1)*.41421356237)*TAU,curveSign=fract((i+1)*.569840291)>.5?1:-1,points=[];
      for(let j=0;j<=segments;j++){
        const t=j/segments,arc=Math.sin(t*PI+phase)*curlRadius*curveSign,drift=t*(.003+curlRadius*1.35),rise=height*t;
        points.push(add(add(add(add(root,mul(normal,shellLift+.001+rise)),mul(flow,drift)),mul(crossFlow,arc)),mul(flow,height*.42*t*combStrength)));
      }
      const tone=.75+.30*fract((i+1)*.41421356237),strandColor=[.28*tone,.19*tone,.135*tone],width=.0011+fract(seed*71.7)*.0010;
      for(let j=0;j<segments;j++){
        const a=points[j],b=points[j+1],ta=norm(sub(b,points[Math.max(0,j-1)])),tb=norm(sub(points[Math.min(segments,j+2)],a)),sa=norm(cross(ta,normal)),sb=norm(cross(tb,normal)),wa=width*(1-j/segments*.58),wb=width*(1-(j+1)/segments*.58),al=add(a,mul(sa,-wa)),ar=add(a,mul(sa,wa)),bl=add(b,mul(sb,-wb)),br=add(b,mul(sb,wb));
        for(const [point,v] of [[al,j/segments],[ar,j/segments],[bl,(j+1)/segments],[bl,(j+1)/segments],[ar,j/segments],[br,(j+1)/segments]]){p.push(...point);n.push(...normal);uv.push(seed,v);const glint=v>.45?.12:0;colors.push(strandColor[0]+glint*.065,strandColor[1]+glint*.045,strandColor[2]+glint*.03);}
      }
    }
    if(!hairFiberBuffer)hairFiberBuffer=meshFromArrays(p,n,uv,null,gl.DYNAMIC_DRAW,colors);
    else {for(const [key,data] of [['position',p],['normal',n],['uv',uv],['color',colors]]){gl.bindBuffer(gl.ARRAY_BUFFER,hairFiberBuffer.buffers[key]);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.DYNAMIC_DRAW);}hairFiberBuffer.count=p.length/3;}
  }
  function drawHairFibers(){if(hairFiberBuffer?.count)drawMesh(hairFiberBuffer,matIdentity(),[.07,.05,.035],1,gl.TRIANGLES);}
  function beardCoverage(theta,phi){
    const a=Math.abs(wrapAngle(theta)),sideGate=1-smooth(.93,1.28,a),beardLine=1.72+.12*smooth(.05,.78,a);
    const jaw=smooth(beardLine-.055,beardLine+.055,phi)*(1-smooth(2.48,2.68,phi))*sideGate;
    const moustache=smooth(1.70,1.77,phi)*(1-smooth(1.91,1.98,phi))*(1-smooth(.22,.37,a));
    const goatee=smooth(1.81,1.9,phi)*(1-smooth(2.46,2.61,phi))*(1-smooth(.38,.56,a));
    return Math.max(jaw,moustache,goatee);
  }
  function buildSkinMesh(){
    const rows=136,cols=192,p=[],n=[],uv=[],colors=[],idx=[],skin=[.58,.40,.31],beard=[.49,.345,.265];
    for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
      const phi=j/rows*PI,theta=i/cols*TAU-PI,point=headPoint(theta,phi),growth=beardCoverage(theta,phi);
      p.push(...point);n.push(...headNormal(theta,phi));uv.push(i/cols,j/rows);for(let k=0;k<3;k++)colors.push(mix(skin[k],beard[k],growth));
      if(i<cols&&j<rows){const a=j*(cols+1)+i,b=a+cols+1;idx.push(a,b,a+1,b,b+1,a+1);}
    }
    if(!skinMesh){skinMesh=meshFromArrays(p,n,uv,idx,gl.DYNAMIC_DRAW,colors);}
    else for(const [key,data] of [['position',p],['normal',n],['uv',uv],['color',colors]]){gl.bindBuffer(gl.ARRAY_BUFFER,skinMesh.buffers[key]);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.DYNAMIC_DRAW);}
    skinDirty=false;
  }

  function invert4(m){const a=Array.from(m),inv=Array.from(matIdentity());for(let i=0;i<4;i++){let pivot=i;for(let r=i+1;r<4;r++)if(Math.abs(a[r*4+i])>Math.abs(a[pivot*4+i]))pivot=r;if(Math.abs(a[pivot*4+i])<1e-10)return matIdentity();for(let c=0;c<4;c++){[a[i*4+c],a[pivot*4+c]]=[a[pivot*4+c],a[i*4+c]];[inv[i*4+c],inv[pivot*4+c]]=[inv[pivot*4+c],inv[i*4+c]];}const d=a[i*4+i];for(let c=0;c<4;c++){a[i*4+c]/=d;inv[i*4+c]/=d;}for(let r=0;r<4;r++)if(r!==i){const k=a[r*4+i];for(let c=0;c<4;c++){a[r*4+c]-=k*a[i*4+c];inv[r*4+c]-=k*inv[i*4+c];}}}return new Float32Array(inv);}
  function transform4(m,p){const x=p[0],y=p[1],z=p[2],w=p[3];return [m[0]*x+m[4]*y+m[8]*z+m[12]*w,m[1]*x+m[5]*y+m[9]*z+m[13]*w,m[2]*x+m[6]*y+m[10]*z+m[14]*w,m[3]*x+m[7]*y+m[11]*z+m[15]*w];}
  const txyz=(p)=>translate(p[0],p[1],p[2]);
  function cameraView(){const cp=Math.cos(camera.pitch),eye=[Math.sin(camera.yaw)*cp*camera.radius,camera.target[1]+Math.sin(camera.pitch)*camera.radius,Math.cos(camera.yaw)*cp*camera.radius];return {eye,view:lookAt(eye,camera.target),projection:perspective(PI/5,canvas.width/Math.max(1,canvas.height),.1,20)};}
  function drawMesh(mesh,model,color,material=0,primitive=gl.TRIANGLES,pointSize=1){
    if(!mesh)return;const {eye,view,projection}=frameCamera||cameraView(),mvp=matMul(matMul(projection,view),model);
    gl.uniformMatrix4fv(uniforms.mvp,false,mvp);gl.uniformMatrix4fv(uniforms.model,false,model);gl.uniform3fv(uniforms.color,new Float32Array(color));gl.uniform1f(uniforms.material,material);gl.uniform1f(uniforms.point,pointSize);gl.uniform1f(uniforms.useVertexColor,mesh.buffers.color?1:0);
    gl.uniform1f(uniforms.referenceBlend,mesh.referenceMap?1:0);gl.uniform1f(uniforms.hairReferenceBlend,mesh.hairReferenceMap?1:0);gl.uniform3fv(uniforms.referenceReady,new Float32Array(skinReferenceReady));
    const referenceKeys=['front','side','back'];for(let i=0;i<referenceKeys.length;i++){gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,skinTextures[referenceKeys[i]]);}
    for(const [name,location] of Object.entries(attrs)){if(location<0)continue;if(mesh.buffers[name]){gl.bindBuffer(gl.ARRAY_BUFFER,mesh.buffers[name]);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,mesh[name+'Size'],gl.FLOAT,false,0,0);}else{gl.disableVertexAttribArray(location);if(name==='normal')gl.vertexAttrib3f(location,0,1,0);else if(name==='uv')gl.vertexAttrib2f(location,0,0);else if(name==='color')gl.vertexAttrib3f(location,1,1,1);}}
    if(mesh.indexed){gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.buffers.index);gl.drawElements(primitive,mesh.count,gl.UNSIGNED_SHORT,0);}else gl.drawArrays(primitive,0,mesh.count);
  }
  function part(position,size,color,rotation=0,material=0,mesh=box){const model=matMul(txyz(position),matMul(rotateZ(rotation),scaleMat(size[0],size[1],size[2])));drawMesh(mesh,model,color,material);}
  function ball(position,size,color,material=0){const model=matMul(txyz(position),scaleMat(size[0],size[1],size[2]));drawMesh(sphere,model,color,material);}
  function lineStrip(points,color,width=2){if(points.length<2)return;if(!lineBuffer)lineBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,lineBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(points.flat()),gl.DYNAMIC_DRAW);const model=matIdentity(),{eye,view,projection}=frameCamera;gl.uniformMatrix4fv(uniforms.mvp,false,matMul(matMul(projection,view),model));gl.uniformMatrix4fv(uniforms.model,false,model);gl.uniform3fv(uniforms.color,new Float32Array(color));gl.uniform1f(uniforms.material,2);gl.uniform1f(uniforms.point,width);gl.uniform1f(uniforms.useVertexColor,0);gl.enableVertexAttribArray(attrs.position);gl.vertexAttrib3f(attrs.color,1,1,1);gl.disableVertexAttribArray(attrs.color);gl.vertexAttribPointer(attrs.position,3,gl.FLOAT,false,0,0);gl.disableVertexAttribArray(attrs.normal);gl.disableVertexAttribArray(attrs.uv);gl.vertexAttrib3f(attrs.normal,0,0,1);gl.vertexAttrib2f(attrs.uv,0,0);gl.lineWidth(width);gl.drawArrays(gl.LINE_STRIP,0,points.length);gl.enableVertexAttribArray(attrs.normal);gl.enableVertexAttribArray(attrs.uv);}
  function ringPoints(phi,thetaStart=-PI,thetaEnd=PI,count=100,lift=.025){const pts=[];for(let i=0;i<=count;i++){const theta=thetaStart+(thetaEnd-thetaStart)*i/count,shapeDrop=style.group==='drop'?.23*(1-Math.cos(theta))/2:0,localPhi=clamp(Math.min(phi+shapeDrop,hairline(theta)-.025),.03,MAX_PHI),p=headPoint(theta,localPhi),n=headNormal(theta,localPhi);pts.push(add(p,mul(n,lift)));}return pts;}

  let frameCamera=null,lineBuffer=null;
  const camera={yaw:0,pitch:.035,radius:3.62,target:[0,.12,0],destination:null};
  let style=GAME.styles[0],mode='guided',stepIndex=0,finished=false,sessionPassed=false,stageViews=new Set(),stepRegions=new Set(),validPasses=0,mistakes=0;
  let currentTool='clipper',guard='#3',guardAttached=false,lever='closed',shearLength=25,combReady=false,combDirection=[1,0],soundOn=false,audioContext=null,toolMotor=null,toolPoint=null,demo=null,lastSoundAt=0;
  let toolActive=false;
  let toolHeld=false,shearsClosed=false,paused=false,pauseStarted=0,feedbackTimer=0,feedbackRemaining=0,feedbackUntil=0,cameraSensitivity=.009,frameId=0;
  let drag=null,strokeInfo=null,stepHairSnapshot=null,stepClippingSnapshot=0,pausedPointerReleased=false,lastRenderAt=performance.now(),simulationTime=0;
  const guardLength=label=>GAME.guards.find(g=>g[0]===label)?.[1]??10;
  function currentStep(){return style.steps[stepIndex]||null;}
  function showFeedback(message,warning=false){const box=$('scene-feedback');box.textContent=message;box.classList.toggle('is-warning',warning);box.classList.add('is-visible');clearTimeout(feedbackTimer);feedbackRemaining=1900;feedbackUntil=performance.now()+feedbackRemaining;if(!paused)feedbackTimer=setTimeout(()=>{box.classList.remove('is-visible');feedbackRemaining=0;},feedbackRemaining);}
  function techniqueCue(tool,movement,regions=[]){const names={leftSide:'left side',rightSide:'right side',leftTemple:'left temple',rightTemple:'right temple',leftSideburn:'left sideburn',rightSideburn:'right sideburn',leftBehindEar:'behind the left ear',rightBehindEar:'behind the right ear',back:'back',neckline:'neckline',top:'top',crown:'crown'},area=(regions||[]).map(r=>names[r]||r).join(' + ')||'selected section',cue={clipper:['blade follows the head','light pressure',movement==='flick'?'short upward flick':'controlled pass','stop at the marked band'],trimmer:['blade corner','feather-light pressure','short edge taps','stop at the natural outline'],razor:['shallow blade angle','very light pressure','short controlled strokes','stop when planned hair is clear'],scissors:['shears aligned to the guide','light hand pressure','small section cuts','stop at the comb or finger guide'],comb:['teeth follow growth','gentle pressure','lift and direct the section','stop when it sits in natural fall'],spray:['nozzle off the skin','light trigger pressure','short mist passes','stop when lightly damp'],brush:['bristles skim the skin','very light pressure','short outward sweeps','stop when loose clippings clear']}[tool]||['follow the head','light pressure','controlled movement','stop at the marked area'];return area+' · angle: '+cue[0]+' · pressure: '+cue[1]+' · move: '+cue[2]+' · stop: '+cue[3]+'.';}
  function updateHud(){const s=currentStep(),stepText=mode==='free'?'OPEN PRACTICE':(s?`${stepIndex+1} / ${style.steps.length}`:'READY TO REVIEW');$('style-level').textContent=`${style.level.split('·').pop().trim()} · ${mode==='free'?'FREE PRACTICE':mode==='challenge'?'SKILL CHECK':'GUIDED PRACTICE'}`;$('style-name').textContent=style.name;$('step-counter').textContent=stepText;$('mistake-count').textContent=`${mistakes} ${mistakes===1?'mistake':'mistakes'}`;$('coach-step').textContent=mode==='free'?'FREE PRACTICE':mode==='challenge'?'SKILL CHECK':s?.type==='look'?'OBSERVE':s?.type==='inspect'?'FINAL CHECK':s?'GUIDED PRACTICE':'SESSION COMPLETE';$('coach-title').textContent=s?.title||(mode==='free'?'Explore the head shape':'Ready to start');$('coach-copy').textContent=mode==='free'?'Choose a tool, guard and lever. Right-click to activate; move the pointer over the head to work.':mode==='challenge'?'Complete the haircut using your own plan. Use the selected tool and setting; rotate the client to inspect your work.':(s?.copy||'Start a guided haircut. Rotate the model, then follow one short practice step at a time.');$('coach-meta').textContent=s?.type==='cut'?techniqueCue(s.tool,s.movement,s.regions):s?.hint||'Virtual practice only. Protect the ears and neck and train real tool handling with supervision.';$('scene-progress-fill').style.width=mode==='free'?'100%':`${Math.round(stepIndex/Math.max(1,style.steps.length)*100)}%`;document.querySelector('.scene-progress')?.setAttribute('aria-valuenow',String(Math.round(stepIndex/Math.max(1,style.steps.length)*100)));$('finish-cut').disabled=mode!=='free'&&!finished;$('finish-cut').textContent=finished?'View session review':'Inspect & finish';$('selected-tool-copy').textContent=currentTool==='clipper'||currentTool==='trimmer'?`${capitalize(currentTool)} · guard ${guard} · lever ${lever}`:`${currentTool==='scissors'?'Shears':capitalize(currentTool)}${currentTool==='scissors'?` · cut length ${shearLength} mm`:combReady?' · comb positioned':''}`;$('interaction-copy').textContent=currentStep()?.type==='look'||currentStep()?.type==='inspect'?'Use the camera buttons or drag the background to inspect every side.':'Left click to select or inspect · right click to use the tool · move the pointer to work.';$('clipper-settings').hidden=!(currentTool==='clipper'||currentTool==='trimmer');$('shear-settings').hidden=!(currentTool==='scissors'||currentTool==='comb');$('comb-ready').setAttribute('aria-pressed',String(combReady));$('comb-ready').textContent=combReady?'Comb positioned ✓':'Sweep comb over hair';$('shear-length-label').textContent=`${shearLength} mm`;}
  function capitalize(word){return word.charAt(0).toUpperCase()+word.slice(1);}
  function toolStatusText(){const name=currentTool==='scissors'?'SHEARS':currentTool.toUpperCase();if(currentTool==='clipper'||currentTool==='trimmer')return `${name} — ${toolActive?'ON':'OFF'}`;if(currentTool==='razor')return `${name} — ${toolActive?'SHAVING':'READY'}`;if(currentTool==='scissors')return `${name} — ${toolActive?'CUTTING':'READY'}`;if(currentTool==='comb')return `${name} — ${toolActive?'COMBING':combReady?'POSITIONED':'READY'}`;if(currentTool==='spray')return `${name} — ${toolActive?'MISTING':'READY'}`;return `${name} — ${toolActive?'BRUSHING':'READY'}`;}
  function updateToolStatus(){const status=$('tool-status');if(!status)return;status.textContent=toolStatusText();status.dataset.state=toolActive?'active':'idle';}
  function startToolMotor(){if(paused||!soundOn||!toolActive||!['clipper','trimmer'].includes(currentTool)||!window.AudioContext||toolMotor)return;try{audioContext??=new AudioContext();if(audioContext.state==='suspended')audioContext.resume();const oscillator=audioContext.createOscillator(),filter=audioContext.createBiquadFilter(),gain=audioContext.createGain(),now=audioContext.currentTime;oscillator.type='sawtooth';oscillator.frequency.value=currentTool==='trimmer'?96:68;filter.type='lowpass';filter.frequency.value=290;gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.009,now+.05);oscillator.connect(filter);filter.connect(gain);gain.connect(audioContext.destination);oscillator.start(now);toolMotor={oscillator,gain};}catch(_){toolMotor=null;}}
  function stopToolMotor(){if(!toolMotor)return;try{const now=audioContext?.currentTime??0;toolMotor.gain.gain.cancelScheduledValues(now);toolMotor.gain.gain.setTargetAtTime(.0001,now,.025);toolMotor.oscillator.stop(now+.12);}catch(_){}toolMotor=null;}
  function setToolActive(active){if(toolActive===active)return;toolActive=active;if(!active)stopToolMotor();else startToolMotor();updateHud();scheduleRender();}
  function finishCurrentStroke(){if(strokeInfo)onStrokeEnd(strokeInfo);strokeInfo=null;}
  function beginStroke(hit){if(!hit)return;toolPoint=hit;strokeInfo={start:hit,end:hit,lastHit:null,regions:new Set(),changedRegions:new Set(),contactRegions:new Set(),phiTotal:0,count:0,cutCells:0,contactCells:0,combHits:0,combMisses:0,path:[]};brushAt(hit);}
  function updateLengthReadout(){let left=0,right=0,n=0,blend=0,bn=0;for(let j=6;j<GRID_PHI-4;j+=2)for(let i=0;i<GRID_THETA;i+=2){const th=i/GRID_THETA*TAU,ph=j/(GRID_PHI-1)*MAX_PHI,a=Math.abs(wrapAngle(th));if(a>.85&&a<1.6&&ph>1.0&&ph<1.78){if(wrapAngle(th)<0)left+=sampleHair(th,ph);else right+=sampleHair(th,ph);n++;}if(a>1.15&&a<1.95&&ph>1.05&&ph<1.82){const d=Math.abs(sampleHair(th,ph)-sampleHair(th+TAU/GRID_THETA,ph));blend+=d;bn++;}}$('left-length').textContent=`${n?Math.round(left/(n/2)):0} mm`;$('right-length').textContent=`${n?Math.round(right/(n/2)):0} mm`;$('blend-quality').textContent=bn?`${Math.max(0,100-Math.round(blend/bn*8))}%`:'—';}
  function setCamera(view){const map={front:[0,.035],left:[-Math.PI/2,.035],right:[Math.PI/2,.035],back:[Math.PI,.035],top:[camera.yaw,1.12],neckline:[Math.PI,-.43]};const target=map[view]||map.front;camera.destination={yaw:target[0],pitch:target[1]};document.querySelectorAll('[data-camera]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.camera===view)));if(mode!=='free'&&currentStep()?.views){stageViews.add(view);if(currentStep().views.every(v=>stageViews.has(v)))completeStage();}updateHud();scheduleRender();}

  function toolFrame(point,normal){const axis=Math.abs(normal[1])>.94?[0,0,1]:[0,1,0],up=norm(sub(axis,mul(normal,dot(axis,normal)))),right=norm(cross(up,normal)),m=matIdentity();m[0]=right[0];m[1]=right[1];m[2]=right[2];m[4]=up[0];m[5]=up[1];m[6]=up[2];m[8]=normal[0];m[9]=normal[1];m[10]=normal[2];m[12]=point[0];m[13]=point[1];m[14]=point[2];return m;}
  function localPart(frame,pos,size,color,material=2,rotation=0){const m=matMul(frame,matMul(translate(pos[0],pos[1],pos[2]),matMul(rotateZ(rotation),scaleMat(size[0],size[1],size[2]))));drawMesh(box,m,color,material);}
  function localBall(frame,pos,size,color,material=0){drawMesh(sphere,matMul(frame,matMul(translate(pos[0],pos[1],pos[2]),scaleMat(size[0],size[1],size[2]))),color,material);}
  function drawHand(frame,small=false){const skin=[.56,.38,.30],shadow=[.43,.27,.21],s=small?.54:.58;localBall(frame,[0,-.16,-.025],[.105*s,.13*s,.065*s],skin);localBall(frame,[0,-.30,-.055],[.078*s,.15*s,.06*s],skin);for(let i=0;i<4;i++){const x=(i-1.5)*.035*s;localBall(frame,[x,-.055,.052],[.019*s,.075*s,.027*s],skin);}localBall(frame,[-.074*s,-.11,.03],[.035*s,.08*s,.038*s],skin);localBall(frame,[-.08*s,-.045,.048],[.03*s,.055*s,.03*s],shadow);}
  function drawMist(){if(!mistEffect)return;const remaining=mistEffect.until-performance.now();if(remaining<=0){mistEffect=null;return;}const fade=remaining/500,p=mistEffect.point,color=[.57+.23*fade,.72+.17*fade,.76+.14*fade];for(let i=0;i<5;i++){const a=i*2.4+remaining*.008,offset=[Math.cos(a)*(.035+(1-fade)*.045),(1-fade)*.04,Math.sin(a)*(.035+(1-fade)*.045)];ball(add(p,offset),[.012*fade+.004,.012*fade+.004,.012*fade+.004],color,0);}}
  function updateClippings(dt){if(!clippings.length||dt<=0)return;const dragFactor=Math.pow(.91,dt*60);for(const p of clippings){p.age+=dt;p.velocity[1]-=.72*dt;p.velocity[0]*=dragFactor;p.velocity[2]*=dragFactor;p.position[0]+=p.velocity[0]*dt;p.position[1]+=p.velocity[1]*dt;p.position[2]+=p.velocity[2]*dt;}const n=clippings.length;clippings=clippings.filter(p=>p.age<p.life&&p.position[1]>-1.72);if(clippings.length!==n)clippingsDirty=true;}
  function releaseClippings(theta,phi,changedCells,cutFromLength){const normal=scalpNormal(theta,phi),root=headPoint(theta,phi),length=Number.isFinite(cutFromLength)?cutFromLength:sampleHair(theta,phi),base=add(root,mul(normal,hairSurfaceOffset(length,.004))),amount=Math.min(4,Math.max(1,Math.ceil(changedCells/20)));for(let i=0;i<amount;i++){const seed=++clippingSeed,side=Math.sin(seed*12.91),forward=Math.cos(seed*8.37);clippings.push({position:[base[0]+side*.012,base[1]+Math.sin(seed*3.3)*.012,base[2]+forward*.012],velocity:[normal[0]*.08+side*.09,-.10-Math.abs(Math.sin(seed*5.7))*.12,normal[2]*.08+forward*.09],age:0,life:1.25+(seed%5)*.11});}if(clippings.length>160)clippings.splice(0,clippings.length-160);clippingsDirty=true;}
  function rebuildClippings(){if(!clippingsDirty)return;if(!clippings.length){if(clippingsMesh)clippingsMesh.count=0;clippingsDirty=false;return;}const p=[],n=[],uv=[];for(const particle of clippings){p.push(...particle.position);n.push(0,1,0);uv.push(0,0);}if(!clippingsMesh)clippingsMesh=meshFromArrays(p,n,uv,null,gl.DYNAMIC_DRAW);else for(const [key,data] of [['position',p],['normal',n],['uv',uv]]){gl.bindBuffer(gl.ARRAY_BUFFER,clippingsMesh.buffers[key]);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.DYNAMIC_DRAW);}clippingsMesh.count=clippings.length;clippingsDirty=false;}
  function drawClippings(){rebuildClippings();if(clippingsMesh?.count)drawMesh(clippingsMesh,matIdentity(),[.15,.105,.07],2,gl.POINTS,3);}
  function drawTool(){let point,normal;if(demo){const now=(performance.now()-demo.start)/demo.duration,t=clamp(now,0,1),theta=mix(demo.a[0],demo.b[0],t),phi=mix(demo.a[1],demo.b[1],t),p=headPoint(theta,phi);normal=headNormal(theta,phi);point=add(p,mul(normal,.01));if(t>=1)demo=null;}else if(toolHeld&&toolPoint){point=toolPoint.point;normal=toolPoint.normal;}else if(toolHeld){point=surfacePoint(.9,1.42);normal=headNormal(.9,1.42);}else{point=[1.47,.19,-.8];normal=[0,1,0];}const isClipper=currentTool==='clipper'||currentTool==='trimmer',reach=currentTool==='clipper'?(guardAttached?.126:.095):currentTool==='trimmer'?.095:currentTool==='scissors'?.037:currentTool==='razor'?.046:currentTool==='comb'?.036:currentTool==='brush'?.027:.1,frame=toolFrame(add(point,mul(normal,reach)),mul(normal,-1)),metal=[.72,.75,.71],dark=[.12,.16,.14],body=[.20,.27,.23],accent=[.83,.84,.77];if(toolActive&&isClipper){const tremor=Math.sin(simulationTime*73)*.0012;frame[12]+=tremor;frame[13]+=Math.cos(simulationTime*61)*.001;}
    if(currentTool==='clipper'||currentTool==='trimmer'){
      const small=currentTool==='trimmer',w=small?.14:.19,h=small?.27:.34;localPart(frame,[0,-.015,0],[w*.87,h*.91,.11],body,2,.02);localPart(frame,[0,-h*.31,.063],[w*.68,.08,.045],dark);localPart(frame,[0,h*.47,.012],[w*1.03,.075,.14],metal);localPart(frame,[0,h*.53,.016],[w*.96,.025,.145],dark);
      for(let i=0;i<7;i++)localPart(frame,[(i-3)*w*.13,h*.57,.017],[.012,.045,.15],accent);
      if(currentTool==='clipper'&&guardAttached){localPart(frame,[0,h*.35,.092],[w*.91,.09,.035],[.55,.61,.55]);localPart(frame,[0,h*.30,.11],[w*.9,.025,.035],accent);for(let i=0;i<8;i++)localPart(frame,[(i-3.5)*w*.11,h*.22,.11],[.009,.09,.025],[.66,.70,.64]);}
      const leverY=lever==='open'?.08:lever==='half'?.035:-.01;localPart(frame,[w*.62,leverY,-.005],[.048,.12,.035],metal,2,lever==='open'?-.25:lever==='half'?-.1:0);
      localBall(frame,[w*.29,-h*.16,.061],[.019,.019,.01],toolActive?[.56,.78,.38]:[.55,.19,.14],2);
    }else if(currentTool==='scissors'){
      const angle=shearsClosed?.12:.42;localPart(frame,[-.025,.09,.025],[.018,.30,.018],metal,2,angle);localPart(frame,[.025,.09,.025],[.018,.30,.018],metal,2,-angle);localPart(frame,[-.075,-.16,.035],[.10,.13,.025],dark,2,.14);localPart(frame,[.075,-.16,.035],[.10,.13,.025],dark,2,-.14);localBall(frame,[-.075,-.16,.05],[.025,.027,.02],metal,2);localBall(frame,[.075,-.16,.05],[.025,.027,.02],metal,2);localBall(frame,[0,-.045,.04],[.026,.026,.022],dark,2);
    }else if(currentTool==='razor'){
      localBall(frame,[0,-.075,.01],[.035,.18,.028],[.17,.20,.18],2);localPart(frame,[0,.055,.025],[.075,.09,.018],metal,2,-.08);localPart(frame,[0,.133,.039],[.22,.043,.014],[.83,.85,.79],2,-.04);localPart(frame,[0,.153,.047],[.20,.008,.008],[.45,.50,.46],2,-.04);localBall(frame,[0,.04,.034],[.021,.021,.018],dark,2);
    }else if(currentTool==='spray'){
      localBall(frame,[0,-.035,.005],[.082,.135,.07],[.48,.63,.60],2);localPart(frame,[0,.08,.005],[.068,.055,.06],metal);localPart(frame,[.035,.14,.012],[.09,.025,.07],dark);localPart(frame,[.08,.12,.012],[.08,.018,.03],metal,2,-.15);localPart(frame,[-.06,.025,.04],[.025,.07,.018],accent,2,.28);
    }else if(currentTool==='brush'){
      localBall(frame,[0,-.025,-.002],[.035,.19,.035],[.43,.31,.22],2);localBall(frame,[0,.16,.012],[.13,.07,.055],[.35,.23,.16],2);for(let i=0;i<9;i++)for(let j=0;j<2;j++)localPart(frame,[(i-4)*.025,.21+j*.016,.018],[.009,.045,.011],[.84,.79,.65],2,(i%2?-.08:.08));
    }else{
      localPart(frame,[0,0,0],[.28,.052,.028],[.66,.70,.62]);for(let i=0;i<13;i++)localPart(frame,[(i-6)*.021,-.045,.027],[.009,.052,.012],[.77,.79,.71]);
    }
    if(toolHeld||demo)drawHand(frame,currentTool==='trimmer');
  }
  function drawClient(){
    const skin=[.54,.35,.27],shadow=[.38,.22,.17],feature=[.085,.052,.035],photoFaceReady=skinReferenceReady.every(Boolean);
    if(humanClientMesh){
      // CC0 MakeHuman upper-body geometry replaces the projected/parametric face.
      // The simulator's scalp and localized hair-length field remain independent.
      drawMesh(bustMesh,matIdentity(),[.055,.067,.06],3);
      drawMesh(humanClientMesh,matIdentity(),[.60,.40,.31],0);
      for(const eye of humanEyeMeshes)drawMesh(eye,matIdentity(),[.87,.82,.73],0);
      for(const side of [-1,1]){
        const iris=makeHumanPoint(side*.305,7.285,1.37),pupil=makeHumanPoint(side*.305,7.285,1.407),glint=makeHumanPoint(side*.296,7.296,1.422);
        ball(iris,[.025,.025,.009],[.18,.105,.065],2);
        ball(pupil,[.011,.014,.006],[.025,.018,.014],2);
        ball(glint,[.0045,.005,.003],[.98,.91,.78],2);
      }
      return;
    }
    // Procedural fallback is retained for browsers opened through file: URLs.
    drawMesh(bustMesh,matIdentity(),[.055,.067,.06],3);
    drawMesh(neckMesh,matIdentity(),[.57,.39,.29],0);
    if(skinDirty)buildSkinMesh();drawMesh(skinMesh,matIdentity(),skin,0);
    if(!photoFaceReady){
    // Shallow auricles sit over the sculpted ear roots; small relief details follow the head.
    for(const side of [-1,1]){
      const earRoot=surfacePoint(side*1.54,1.47,.01),earCenter=[earRoot[0]+side*.028,earRoot[1],earRoot[2]+.006];
      ball(earCenter,[.086,.17,.048],skin,0);
      const cavity=[earCenter[0]+side*.004,earCenter[1]-.004,earCenter[2]+.043],tragus=[earCenter[0]-side*.039,earCenter[1]-.034,earCenter[2]+.045];
      ball(cavity,[.023,.054,.009],[.34,.21,.17],0);ball(tragus,[.023,.036,.018],skin,0);
      const helix=[];for(let i=0;i<=20;i++){const t=i/20*PI*1.55-.82,arch=Math.cos(t);helix.push([earCenter[0]+side*(.018+.028*arch),earCenter[1]+.067*Math.sin(t),earCenter[2]+.047]);}lineStrip(helix,[.69,.48,.39],1.1);
      const eyeTheta=side*.43,eye=surfacePoint(eyeTheta,1.345,.004),eyeN=headNormal(eyeTheta,1.345),iris=add(eye,mul(eyeN,.009)),pupil=add(eye,mul(eyeN,.016));
      ball(eye,[.068,.026,.012],[.73,.66,.59],0);ball(iris,[.024,.024,.01],[.22,.12,.075],0);ball(pupil,[.009,.012,.006],feature,0);ball(add(pupil,[side*.003,.006,.004]),[.0035,.0045,.002],[.98,.94,.84],0);
      const upperLid=[],lowerLid=[],brow=[];for(let i=0;i<=18;i++){const t=i/18,q=t*2-1,theta=side*(.43+q*.15),arch=Math.sqrt(Math.max(0,1-q*q));upperLid.push(surfacePoint(theta,1.345-.040*arch,.022));lowerLid.push(surfacePoint(theta,1.345+.033*arch,.020));if(i%2===0)brow.push(surfacePoint(side*(.25+t*.36),1.235-.042*Math.sin(t*PI),.022));}
      lineStrip(upperLid,[.28,.18,.14],1.25);lineStrip(lowerLid,[.54,.36,.30],1.0);lineStrip(brow,shadow,1.45);
    }
    for(const side of [-1,1]){const p=surfacePoint(side*.105,1.765,.008);ball(p,[.018,.008,.006],feature,0);}
    const upperLip=[],lowerLip=[];for(let i=0;i<=16;i++){const t=i/16,theta=mix(-.24,.24,t),curve=Math.sin(t*PI);upperLip.push(surfacePoint(theta,1.92-.015*curve,.012));lowerLip.push(surfacePoint(theta,1.95+.008*curve,.01));}
    lineStrip(upperLip,[.35,.20,.17],2);lineStrip(lowerLip,[.48,.30,.25],1.5);
    }
  }
  function drawEnvironment(){
    // Matte room walls sit outside the full orbit radius, so they stay behind the client at every camera view.
    const room=6.15,wallY=.18,wallHeight=5.8,wallWidth=12.3,wallDepth=.12,wall=[.46,.46,.43],wainscot=[.37,.38,.36],rail=[.53,.51,.46];
    part([0,wallY,-room],[wallWidth,wallHeight,wallDepth],wall,0,3);part([0,wallY,room],[wallWidth,wallHeight,wallDepth],wall,0,3);
    part([-room,wallY,0],[wallDepth,wallHeight,wallWidth],wall,0,3);part([room,wallY,0],[wallDepth,wallHeight,wallWidth],wall,0,3);
    part([0,-1.42,-room+.07],[wallWidth,.88,.025],wainscot,0,3);part([0,-1.42,room-.07],[wallWidth,.88,.025],wainscot,0,3);
    part([-room+.07,-1.42,0],[.025,.88,wallWidth],wainscot,0,3);part([room-.07,-1.42,0],[.025,.88,wallWidth],wainscot,0,3);
    part([0,-.95,-room+.055],[wallWidth,.035,.035],rail,0,3);part([0,-.95,room-.055],[wallWidth,.035,.035],rail,0,3);
    part([-room+.055,-.95,0],[.035,.035,wallWidth],rail,0,3);part([room-.055,-.95,0],[.035,.035,wallWidth],rail,0,3);
    part([0,-.89,-.38],[.85,.78,.24],[.11,.15,.12],0,2);
    part([1.47,-.29,-.82],[.42,.72,.50],[.16,.20,.17],0,2);part([1.47,.09,-.80],[.54,.08,.60],[.21,.25,.21],0,2);part([1.47,-.22,-.49],[.36,.025,.035],[.66,.69,.61],0,2);
    part([0,-1.56,-.20],[.12,.47,.12],[.14,.17,.15],0,2);part([0,-1.83,-.20],[1.05,.09,.64],[.10,.13,.11],0,2);part([0,-1.78,-.20],[.36,.13,.30],[.19,.23,.20],0,2);
  }
  function patternGuidePoints(basePhi,start,end,steps=68,lift=.05){const pts=[];for(let i=0;i<=steps;i++){const theta=mix(start,end,i/steps),phi=clamp(guidePhiAt(theta,basePhi),.08,hairline(theta)-.03),p=headPoint(theta,phi);pts.push(add(p,mul(headNormal(theta,phi),lift)));}return pts;}
  function zoneEdge(theta,startPhi,endPhi){const pts=[],drop=style.group==='drop'?.23*(1-Math.cos(theta))/2:0;for(let i=0;i<=22;i++){const phi=Math.min(mix(startPhi,endPhi,i/22)+drop,hairline(theta)-.025),p=headPoint(theta,phi);pts.push(add(p,mul(headNormal(theta,phi),.038)));}return pts;}
  function drawGuides(){const s=currentStep();if(!s||s.type!=='cut')return;const color=s.movement==='guide'?[.88,.82,.38]:[.78,.84,.67],sideZones={leftSide:[[-2.14,-1.1],.92,1.8],rightSide:[[1.1,2.14],.92,1.8],leftTemple:[[-1.24,-.68],1.02,1.46],rightTemple:[[.68,1.24],1.02,1.46],leftSideburn:[[-1.28,-.76],1.36,1.78],rightSideburn:[[.76,1.28],1.36,1.78],leftBehindEar:[[-2.02,-1.25],1.35,1.78],rightBehindEar:[[1.25,2.02],1.35,1.78],back:[[[-PI,-2.26],[2.26,PI]],.9,1.8],neckline:[[[-PI,-2.42],[2.42,PI]],1.72,1.98]};
    for(const region of s.regions){if(region==='top'){lineStrip(ringPoints(.55,-PI,PI,96,.04),color,2);continue;}if(region==='crown'){lineStrip(ringPoints(.86,-PI,PI,96,.04),color,2);continue;}const bounds=sideZones[region];if(!bounds)continue;const ranges=Array.isArray(bounds[0][0])?bounds[0]:[bounds[0]],low=bounds[1],high=bounds[2];for(const [start,end] of ranges){lineStrip(ringPoints(low,start,end,44,.04),color,1.5);lineStrip(ringPoints(high,start,end,44,.04),color,1.5);lineStrip(zoneEdge(start,low,high),color,1.5);lineStrip(zoneEdge(end,low,high),color,1.5);}}
    let phi=s.guidePhi;if(phi==null&&s.phiRange)phi=(s.phiRange[0]+s.phiRange[1])/2;if(phi==null)return;const arcs=style.group==='burst'?[[-2.3,-.72],[.72,2.3]]:[[-PI,-.72],[.72,PI]];for(const [start,end] of arcs)lineStrip(patternGuidePoints(phi,start,end,68,.05),s.movement==='guide'?[.95,.86,.43]:color,2);if(s.phiRange)for(const [start,end] of arcs){lineStrip(patternGuidePoints(s.phiRange[1],start,end,66,.026),[.53,.66,.50],1);lineStrip(patternGuidePoints(s.phiRange[0],start,end,66,.026),[.53,.66,.50],1);}}
  function drawCrownSwirl(){const points=[];for(let i=0;i<=48;i++){const t=i/48*TAU,r=.025+t/TAU*.105,theta=PI+Math.cos(t)*r,phi=.25+Math.sin(t)*r,p=headPoint(theta,phi),n=headNormal(theta,phi),lift=hairSurfaceOffset(sampleHair(theta,phi),.004);points.push(add(p,mul(n,lift)));}lineStrip(points,[.24,.18,.12],1);}
  function scheduleRender(){if(!frameId)frameId=requestAnimationFrame(render);}
  function render(){frameId=0;if(paused||!gl||!canvas.isConnected)return;const now=performance.now(),frameSeconds=clamp((now-lastRenderAt)/1000,0,.05);lastRenderAt=now;simulationTime+=frameSeconds;updateClippings(frameSeconds);let easing=false;if(camera.destination){const d=camera.destination,dyaw=wrapAngle(d.yaw-camera.yaw),dpitch=d.pitch-camera.pitch,dradius=(d.radius??camera.radius)-camera.radius;camera.yaw+=dyaw*.19;camera.pitch+=dpitch*.19;camera.radius+=dradius*.19;if(Math.abs(dyaw)<.001&&Math.abs(dpitch)<.001&&Math.abs(dradius)<.001){camera.yaw=d.yaw;camera.pitch=d.pitch;if(d.radius!=null)camera.radius=d.radius;camera.destination=null;}else easing=true;}const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.4),w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);frameCamera=cameraView();gl.useProgram(program);gl.uniform3fv(uniforms.eye,new Float32Array(frameCamera.eye));
    drawEnvironment();drawClient();if(hairDirty)buildHairMesh();drawMesh(hairMesh,matIdentity(),[.105,.072,.047],1);drawHairFibers();drawClippings();drawCrownSwirl();drawGuides();drawTool();drawMist();if(demo||easing||mistEffect||toolActive||clippings.length)scheduleRender();}

  function rayHit(clientX,clientY){
    const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return null;
    const x=((clientX-rect.left)/rect.width)*2-1,y=1-((clientY-rect.top)/rect.height)*2,{eye}=cameraView(),forward=norm(sub(camera.target,eye)),right=norm(cross(forward,[0,1,0])),up=norm(cross(right,forward)),tanFov=Math.tan(PI/10),direction=norm(add(add(forward,mul(right,x*tanFov*rect.width/rect.height)),mul(up,y*tanFov))),origin=eye;
    const relative=sub(origin,HEAD),a=dot(direction,direction),b=2*dot(relative,direction),c=dot(relative,relative)-1.3*1.3,disc=b*b-4*a*c;if(disc<0)return null;
    let t=(-b-Math.sqrt(disc))/(2*a);if(t<0)return null;let theta=0,phi=0,point=null,normal=null;
    for(let i=0;i<9;i++){
      const rayPoint=add(origin,mul(direction,t)),q=[(rayPoint[0]-HEAD[0])/headDims[0],(rayPoint[1]-HEAD[1])/headDims[1],(rayPoint[2]-HEAD[2])/headDims[2]];
      theta=Math.atan2(q[0],q[2]);phi=Math.acos(clamp(q[1]/Math.max(1,Math.hypot(...q)), -1,1));
      if(phi>hairline(theta)+.32||phi>MAX_PHI)return null;
      point=add(headPoint(theta,phi),mul(scalpNormal(theta,phi),hairSurfaceOffset(sampleHair(theta,phi))));normal=scalpNormal(theta,phi);
      const denominator=dot(direction,normal);if(Math.abs(denominator)<.045)break;const correction=dot(sub(point,rayPoint),normal)/denominator;t+=correction;if(t<0)return null;if(Math.abs(correction)<.00012)break;
    }
    if(phi>hairline(theta)+.12||phi>MAX_PHI)return null;
    return {point,normal,theta,phi,region:regionAt(theta,phi),hairLength:sampleHair(theta,phi)};
  }

  function cutLength(){if(currentTool==='razor')return .16;if(currentTool==='trimmer')return guardLength('No guard');if(currentTool==='scissors')return clamp(Number(shearLength),1,50);return (guardAttached?guardLength(guard):guardLength('No guard'))+(GAME.leverOffsets[lever]||0);}
  function cutSegment(from,to){
    if(currentTool==='comb'||currentTool==='brush'||currentTool==='spray')return 0;const deltaTheta=wrapAngle(to.theta-from.theta),distance=Math.hypot(deltaTheta*Math.sin((from.phi+to.phi)/2),to.phi-from.phi),count=Math.max(1,Math.ceil(distance/.035)),footprint=currentTool==='trimmer'?[.031,.052]:currentTool==='razor'?[.044,.068]:currentTool==='scissors'?[.052,.075]:currentStep()?.movement==='guide'?[.052,.046]:[.078,.12],radiusTheta=footprint[0],radiusPhi=footprint[1],cutTo=cutLength(),s=currentStep();let changed=0;
    const contactLengthBefore=sampleHair(to.theta,to.phi);
    for(let sample=0;sample<=count;sample++){const t=sample/count,theta=from.theta+deltaTheta*t,phi=mix(from.phi,to.phi,t);if(s?.requiresComb&&['scissors','clipper'].includes(currentTool)){const aligned=combReady&&combPath.some(point=>headDistance({theta,phi},point)<.14);if(!aligned){if(strokeInfo)strokeInfo.combMisses++;continue;}if(strokeInfo)strokeInfo.combHits++;}const centerU=((theta/TAU)%1+1)%1*GRID_THETA,centerV=clamp(phi/MAX_PHI,0,1)*(GRID_PHI-1),rx=Math.ceil(radiusTheta/(TAU/GRID_THETA)),ry=Math.ceil(radiusPhi/MAX_PHI*(GRID_PHI-1));for(let dy=-ry;dy<=ry;dy++){const iy=Math.round(centerV)+dy;if(iy<0||iy>=GRID_PHI)continue;const ph=iy/(GRID_PHI-1)*MAX_PHI;if(ph>hairline(theta))continue;for(let dx=-rx;dx<=rx;dx++){const ix=(Math.round(centerU)+dx+GRID_THETA)%GRID_THETA,th=ix/GRID_THETA*TAU,dth=Math.abs(wrapAngle(th-theta))*Math.sin(ph),dph=ph-phi,dist=Math.sqrt((dth/radiusTheta)**2+(dph/radiusPhi)**2);if(dist>1)continue;const index=iy*GRID_THETA+ix,weight=1-dist*.22,desired=cutTo+(1-weight)*1.2;if(strokeInfo){strokeInfo.contactCells++;strokeInfo.contactRegions.add(regionAt(th,ph));}if(hairField[index]>desired){hairField[index]=desired;changed++;}}}}
    if(changed){hairDirty=true;releaseClippings(to.theta,to.phi,changed,contactLengthBefore);if(soundOn&&performance.now()-lastSoundAt>130){lastSoundAt=performance.now();playClipperSound();}}return changed;
  }
  function expandedRegion(region){if(region==='leftBehindEar')return 'leftSide';if(region==='rightBehindEar')return 'rightSide';return region;}
  function acceptRegion(expected,actual){return expected===actual||expected===expandedRegion(actual);}
  function expectedStageSettings(s){const attachmentMatches=s.guard==='No guard'?!guardAttached:guardAttached;return toolHeld&&s.tool===currentTool&&(s.tool!=='clipper'||s.guard===guard&&s.lever===lever&&attachmentMatches)&&(s.tool!=='scissors'||!Number.isFinite(s.shearLength)||shearLength===s.shearLength)&&(!s.requiresComb||combReady);}
  function onStrokeEnd(info){
    if(!info)return;const s=currentStep();
    if(currentTool==='comb'){
      const dTheta=wrapAngle(info.end.theta-info.start.theta),dPhi=info.end.phi-info.start.phi,magnitude=Math.hypot(dTheta,dPhi);if(magnitude<=.01||info.path.length<2){showFeedback('Sweep the comb through a real section to position and direct the hair.',true);return;}
      combDirection=[dTheta/magnitude,dPhi/magnitude];combPath=info.path.filter((_,index)=>index%Math.max(1,Math.ceil(info.path.length/32))===0).slice(0,32);if(combPath.length<2)combPath=[info.path[0],info.path[info.path.length-1]];combReady=true;hairDirty=true;updateLengthReadout();
      if(s?.type==='cut'&&s.tool==='comb'){const settingsCorrect=expectedStageSettings(s),matching=[...info.regions].filter(actual=>s.regions.some(expected=>acceptRegion(expected,actual)));for(const region of matching)stepRegions.add(region);const coverage=s.regions.every(expected=>[...stepRegions].some(actual=>acceptRegion(expected,actual)));if(!settingsCorrect||!coverage){mistakes++;showFeedback(!settingsCorrect?'Choose the comb for this step, then sweep the highlighted section.':'Comb through the highlighted sections, then release to set the direction.',true);updateHud();return;}validPasses++;if(validPasses>=Math.max(1,s.passes||1)){completeStage();return;}}
      showFeedback('Hair directed along the comb path. Keep the comb near the section while you cut.');updateHud();return;
    }
    if(mode==='free'){updateLengthReadout();updateHud();return;}if(!s||s.type!=='cut'){updateLengthReadout();return;}
    const settingsCorrect=expectedStageSettings(s),path=info.path.length?info.path:[info.start,info.end],heightCorrect=path.filter(point=>s.guidePhi!=null?Math.abs(point.phi-guidePhiAt(point.theta,s.guidePhi))<=(s.guideTolerance||.18):s.phiRange?point.phi>=guidePhiAt(point.theta,s.phiRange[0])-.025&&point.phi<=guidePhiAt(point.theta,s.phiRange[1])+.025:true).length/Math.max(1,path.length)>=.68;
    let movementCorrect=true;if(s.movement==='flick')movementCorrect=info.end.phi<info.start.phi-.012;if(s.movement==='guide')movementCorrect=Math.hypot(wrapAngle(info.end.theta-info.start.theta),info.end.phi-info.start.phi)>.035;if(s.movement==='edge')movementCorrect=Math.hypot(wrapAngle(info.end.theta-info.start.theta),info.end.phi-info.start.phi)<.6;
    const sourceRegions=info.changedRegions,matching=[...sourceRegions].filter(actual=>s.regions.some(expected=>acceptRegion(expected,actual))),combContact=!s.requiresComb||(combReady&&info.combHits>0);
    if(!settingsCorrect||!heightCorrect||!movementCorrect||!matching.length||info.cutCells<2||!combContact){const setup='Check tool setup: '+s.tool+(s.tool==='clipper'?' · '+s.guard+', lever '+s.lever:s.tool==='scissors'&&Number.isFinite(s.shearLength)?' · about '+s.shearLength+' mm':'')+(s.requiresComb?' · comb the same section first':'')+'.';const message=!settingsCorrect?setup:!combContact?'Keep the clipper or shears directly over the section lifted by the comb.':!heightCorrect?'That pass was outside the highlighted height. Follow the curved guide and try again.':!movementCorrect?(s.movement==='flick'?'Use a short upward pass, then flick the clipper away.':'Keep the pass within the movement shown.'):info.cutCells<2?'No new hair changed on this pass. Move to an uncut part of the highlighted zone and try again.':!matching.length?'Move over the highlighted region; only a pass that changes hair counts.':'Move over the remaining highlighted region, then release.';mistakes++;showFeedback(message,true);updateHud();return;}
    for(const region of matching)stepRegions.add(region);const coverage=s.regions.every(expected=>[...stepRegions].some(actual=>acceptRegion(expected,actual)));validPasses++;if(coverage&&validPasses>=Math.max(1,s.passes||1)){completeStage();return;}showFeedback(coverage?'Good controlled pass. Add one more pass if the guide asks for it.':'Good. Now cut the other highlighted region.');updateLengthReadout();updateHud();
  }
  function recordSessionProgress(){
    const scores=sessionScores(),score=Math.round(scores.reduce((sum,item)=>sum+item.value,0)/scores.length),shape=scores.find(item=>item.label==='Shape')?.value??0,evenness=scores.find(item=>item.label==='Evenness')?.value??0;
    sessionPassed=shape>=38&&evenness>=50&&mistakes<=8;
    try{
      const key='craft-sim-progress-v2',saved=JSON.parse(localStorage.getItem(key)||'{}'),styles=saved.styles||{},prior=styles[style.id]||{attempts:0,best:0};
      styles[style.id]={attempts:prior.attempts+1,last:score,best:Math.max(prior.best,score),bestScores:score>=prior.best?scores:prior.bestScores||scores,passed:prior.passed||sessionPassed};
      const next={styles,skillCheckUnlocked:Boolean(saved.skillCheckUnlocked||sessionPassed)};localStorage.setItem(key,JSON.stringify(next));
    }catch(_){}
    if(sessionPassed&&mode==='guided'){try{localStorage.setItem('craft-sim-guided-complete','1');}catch(_){}const challenge=document.querySelector('[data-mode="challenge"]');challenge.disabled=false;challenge.title='Skill check unlocked after a guided result check';challenge.textContent='Skill check';}
    return {score,sessionPassed};
  }
  function prepareGuidedCutStep(step){
    if(mode!=='guided'||step?.type!=='cut')return;
    currentTool=step.tool;
    toolHeld=false;
    guardAttached=false;
    toolPoint=null;
    if(step.guard)guard=step.guard;
    if(step.lever)lever=step.lever;
    if(step.tool==='scissors'&&Number.isFinite(step.shearLength))shearLength=step.shearLength;
    document.querySelectorAll('[data-tool]').forEach(button=>button.classList.toggle('is-selected',button.dataset.tool===currentTool));
    document.querySelectorAll('[data-guard]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.guard===guard)));
    document.querySelectorAll('[data-lever]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lever===lever)));
    $('shear-length').value=String(shearLength);
    $('shear-length-label').textContent=`${shearLength} mm`;
  }
  function completeStage(){
    const old=currentStep();stepIndex++;stageViews.clear();stepRegions.clear();validPasses=0;
    if(!currentStep()?.requiresComb){combReady=false;combPath=[];}
    prepareGuidedCutStep(currentStep());
    stepHairSnapshot=hairField.slice();stepClippingSnapshot=clippings.length;
    if(currentStep()?.type==='cut'||currentStep()?.type==='inspect'){
      camera.destination={yaw:0,pitch:.035};stageViews.add('front');
      document.querySelectorAll('[data-camera]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.camera==='front')));
    }
    if(stepIndex>=style.steps.length){finished=true;const result=recordSessionProgress();showFeedback(result.sessionPassed?'Session review is ready. Your shape check unlocked the skill check.':'Practice saved. Compare the result with the target, then repeat to improve your shape score.');}
    else if(currentStep()?.type==='inspect')showFeedback('Cut complete. Inspect front, sides and back.');
    else showFeedback(`${old?.title||'Step'} complete. Next: ${currentStep()?.title||'review'}.`);
    updateHud();
  }
  function brushAt(hit){
    if(!hit)return;const previous=strokeInfo?.lastHit;if(currentTool==='spray'){mistEffect={point:hit.point,until:performance.now()+500};scheduleRender();}else if(currentTool==='brush'){const before=clippings.length;clippings=clippings.filter(p=>Math.hypot(p.position[0]-hit.point[0],p.position[1]-hit.point[1],p.position[2]-hit.point[2])>.35);if(clippings.length!==before){clippingsDirty=true;showFeedback((before-clippings.length)+' loose clipping'+(before-clippings.length===1?'':'s')+' brushed from the neckline.');}}else if(currentTool!=='comb'){const changed=previous?cutSegment(previous,hit):cutSegment(hit,hit);if(strokeInfo&&changed){strokeInfo.cutCells+=changed;strokeInfo.changedRegions.add(hit.region);}}
    if(strokeInfo){strokeInfo.lastHit=hit;strokeInfo.regions.add(hit.region);strokeInfo.phiTotal+=hit.phi;strokeInfo.count++;strokeInfo.end=hit;if(currentTool==='comb'){const sample={theta:hit.theta,phi:hit.phi,region:hit.region},last=strokeInfo.path[strokeInfo.path.length-1];if(!last||headDistance(last,sample)>.01)strokeInfo.path.push(sample);}else if(!strokeInfo.path.length||headDistance(strokeInfo.path[strokeInfo.path.length-1],hit)>.01)strokeInfo.path.push({theta:hit.theta,phi:hit.phi,region:hit.region});}
  }
  function onPointerDown(event){if(paused)return;if(event.button===2){event.preventDefault();const hit=rayHit(event.clientX,event.clientY),s=currentStep();if(!toolHeld){showFeedback('Pick up the selected tool before using it.',true);return;}if(currentTool==='clipper'||currentTool==='trimmer'){if(toolActive){const guidedPass=mode!=='free'&&s?.type==='cut'&&Boolean(strokeInfo);finishCurrentStroke();setToolActive(false);if(!guidedPass)showFeedback(`${capitalize(currentTool)} off. The pass is finished.`);}else{setToolActive(true);if(hit&&(mode==='free'||s?.type==='cut'))beginStroke(hit);showFeedback(`${capitalize(currentTool)} on. Move the pointer across the hair to cut; right-click again to switch it off.`);}event.preventDefault();return;}if(!hit){showFeedback('Move the tool onto the hair or skin, then right-click to use it.',true);return;}if(currentTool==='comb'){combReady=false;combPath=[];hairDirty=true;}if(mode!=='free'&&s?.type!=='cut'){showFeedback('This step is for observing. Continue to the next cutting step to use tools.',true);return;}if(currentTool==='scissors'&&s?.requiresComb&&!combReady){showFeedback('Comb this section first, then use the shears for scissor-over-comb.',true);return;}setToolActive(true);drag={type:'use',pointerId:event.pointerId};canvas.setPointerCapture?.(event.pointerId);shearsClosed=currentTool==='scissors';beginStroke(hit);event.preventDefault();scheduleRender();return;}if(event.button!==0)return;const hit=rayHit(event.clientX,event.clientY);if(hit&&toolHeld)toolPoint=hit;drag={type:'orbit',pointerId:event.pointerId,lastX:event.clientX,lastY:event.clientY,moved:false};canvas.setPointerCapture?.(event.pointerId);canvas.focus({preventScroll:true});}
  function onPointerMove(event){if(paused)return;const hit=rayHit(event.clientX,event.clientY);if(hit&&!drag&&toolHeld){toolPoint=hit;if(toolActive&&(currentTool==='clipper'||currentTool==='trimmer')&&(mode==='free'||currentStep()?.type==='cut')){if(strokeInfo?.lastHit)brushAt(hit);else beginStroke(hit);}}else if(!hit&&toolActive&&strokeInfo&&drag?.type!=='use')strokeInfo.lastHit=null;if(drag?.pointerId===event.pointerId){if(drag.type==='use'){if(hit){toolPoint=hit;brushAt(hit);}else if(strokeInfo)strokeInfo.lastHit=null;event.preventDefault();}else if(drag.type==='orbit'){const dx=event.clientX-drag.lastX,dy=event.clientY-drag.lastY;if(Math.abs(dx)+Math.abs(dy)>2)drag.moved=true;camera.destination=null;camera.yaw+=dx*cameraSensitivity;camera.pitch=clamp(camera.pitch+dy*.007,-.72,1.23);drag.lastX=event.clientX;drag.lastY=event.clientY;}}scheduleRender();}
  function onPointerUp(event){if(paused){if(drag?.pointerId===event.pointerId)pausedPointerReleased=true;return;}if(!drag||drag.pointerId!==event.pointerId)return;if(drag.type==='use'){finishCurrentStroke();setToolActive(false);}drag=null;shearsClosed=false;scheduleRender();}
  function initializeCut(targetStyle,selectedMode='guided',options={}){if(toolActive)setToolActive(false);finishCurrentStroke();if(paused){paused=false;$('pause-menu').hidden=true;}style=targetStyle;mode=selectedMode;stepIndex=0;mistakes=0;validPasses=0;finished=false;sessionPassed=false;stageViews=new Set(['front']);stepRegions=new Set();combReady=false;combDirection=[1,0];guardAttached=false;toolHeld=false;demo=null;camera.destination=null;updateHeadShape(options.shape||style.shape||'oval');const plannedLength=Math.max(GAME.initialHairLength,Math.min(60,Math.ceil(Math.max(...Object.values(style.target))+4)));initHair(options.length??plannedLength);stepHairSnapshot=hairField.slice();stepClippingSnapshot=0;camera.yaw=0;camera.pitch=.035;camera.radius=3.62;toolPoint=null;document.querySelectorAll('[data-camera]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.camera==='front')));if(options.tool){chooseTool(options.tool);toolHeld=true;}if(options.guard)chooseGuard(options.guard);updateHud();updateLengthReadout();$('result-panel').hidden=true;showFeedback(mode==='free'?'Free practice is ready.':'Client ready. Rotate the head to begin.');}
  function chooseTool(tool){if(tool===currentTool){toolHeld=true;updateHud();return;}finishCurrentStroke();if(toolActive)setToolActive(false);currentTool=tool;toolHeld=true;document.querySelectorAll('[data-tool]').forEach(button=>button.classList.toggle('is-selected',button.dataset.tool===tool));updateHud();}
  function chooseGuard(value){guard=value;guardAttached=false;document.querySelectorAll('[data-guard]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.guard===value)));updateHud();}
  function chooseLever(value){lever=value;document.querySelectorAll('[data-lever]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lever===value)));updateHud();}

  function setMode(next){if(next==='free'){$('free-settings').hidden=false;return;}if(next==='challenge'){let unlocked=false;try{unlocked=localStorage.getItem('craft-sim-guided-complete')==='1';}catch(_){}if(!unlocked){showFeedback('Finish one Guided haircut to unlock the skill check.',true);return;}}mode=next;document.querySelectorAll('[data-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===next)));initializeCut(style,next);}
  function showLessonDemo(){if(mode==='challenge'){showFeedback('Skill check: use your memory from Guided practice.');return;}const s=currentStep();if(!s||s.type!=='cut'){showFeedback('Rotate the client to compare the front, sides and back.');return;}let theta=0;if(s.regions.includes('leftSide')||s.regions.includes('leftTemple'))theta=-1.35;else if(s.regions.includes('rightSide')||s.regions.includes('rightTemple'))theta=1.35;else if(s.regions.includes('back')||s.regions.includes('neckline'))theta=2.6;const phi=s.regions.includes('top')?.38:s.regions.includes('neckline')?1.85:s.regions.some(r=>r.includes('Sideburn'))?1.58:(s.guidePhi??(s.phiRange?(s.phiRange[0]+s.phiRange[1])/2:1.25));demo={a:[theta-.28,phi+.10],b:[theta+.28,phi-.08],start:performance.now(),duration:1500};showFeedback('Watch the tool path and the highlighted working height.');scheduleRender();}
  function playClipperSound(){if(!soundOn||!window.AudioContext)return;try{audioContext??=new AudioContext();if(audioContext.state==='suspended')audioContext.resume();const oscillator=audioContext.createOscillator(),gain=audioContext.createGain(),now=audioContext.currentTime;oscillator.type='sawtooth';oscillator.frequency.value=currentTool==='trimmer'?92:68;gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.018,now+.018);gain.gain.exponentialRampToValueAtTime(.0001,now+.12);oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start(now);oscillator.stop(now+.13);}catch(_){}}
  function sessionScores(){let accuracyError=0,symmetryError=0,blendError=0,n=0,sn=0,bn=0;for(let j=2;j<GRID_PHI-2;j+=2){const phi=j/(GRID_PHI-1)*MAX_PHI;for(let i=0;i<GRID_THETA;i+=3){const theta=i/GRID_THETA*TAU;if(phi>hairline(theta))continue;const actual=sampleHair(theta,phi),expected=Number(style.target[regionAt(theta,phi)]??20);accuracyError+=Math.abs(actual-expected);n++;const mirror=sampleHair(-theta,phi);if(Math.abs(wrapAngle(theta))<1.75){symmetryError+=Math.abs(actual-mirror);sn++;}if(j<GRID_PHI-3){blendError+=Math.abs(actual-sampleHair(theta,phi+MAX_PHI/(GRID_PHI-1)*2));bn++;}}}const accuracy=clamp(Math.round(100-(accuracyError/Math.max(n,1))*2.7),0,100),symmetry=clamp(Math.round(100-(symmetryError/Math.max(sn,1))*5),0,100),blend=clamp(Math.round(100-(blendError/Math.max(bn,1))*4.2),0,100),control=clamp(100-mistakes*7,0,100);return [{label:'Shape',value:accuracy},{label:'Evenness',value:symmetry},{label:'Blend',value:blend},{label:'Control',value:control}];}
  function openReview(){if(mode!=='free'&&!finished){showFeedback('Complete the guided inspection first, or switch to Free practice to review anytime.',true);return;}const scores=sessionScores(),mean=Math.round(scores.reduce((sum,item)=>sum+item.value,0)/scores.length);$('result-style').textContent=`${style.name} · ${mode==='free'?'Free practice':mode==='challenge'?'Skill check':'Guided practice'}`;$('result-scores').innerHTML=scores.map(item=>`<div><span>${item.label}</span><strong>${item.value}</strong></div>`).join('');$('result-note').textContent=mean>=80?`${style.note} Good control. Review both profiles once more before saving this as your reference.`:mean>=55?`${style.note} Your strongest next step is to revisit the lower transition and compare the two sides.`:`${style.note} Keep practicing one zone at a time. Use the height guides, move slowly and compare the left and right profiles.`;$('result-note').textContent+=mode==='guided'?(sessionPassed?' The measured shape and symmetry check passed. This unlocks a skill check; it is not a claim of professional mastery.':' Your attempt was saved. Repeat the guided work to improve the measured shape and symmetry checks; completion alone does not award mastery.'):' Simulator practice supports learning but does not replace supervised work on a mannequin or client.';$('result-title').textContent=finished?(sessionPassed?'Practice check passed':'Practice complete'):'Practice review';$('result-panel').hidden=false;}
  function setPaused(value){if(value===paused)return;if(value){paused=true;pauseStarted=performance.now();pausedPointerReleased=false;feedbackRemaining=Math.max(0,feedbackUntil-pauseStarted);clearTimeout(feedbackTimer);feedbackTimer=0;stopToolMotor();cancelAnimationFrame(frameId);frameId=0;if(audioContext?.state==='running')audioContext.suspend().catch(()=>{});$('pause-menu').hidden=false;$('pause-home').hidden=false;$('pause-controls-panel').hidden=true;$('pause-settings-panel').hidden=true;$('pause-sound-toggle').setAttribute('aria-pressed',String(soundOn));$('pause-sound-toggle').textContent=soundOn?'Sound on':'Sound off';$('resume-game').focus();return;}const now=performance.now(),pausedFor=now-pauseStarted;paused=false;lastRenderAt=now;if(demo)demo.start+=pausedFor;if(mistEffect)mistEffect.until+=pausedFor;if(feedbackRemaining>0){feedbackUntil=now+feedbackRemaining;feedbackTimer=setTimeout(()=>{$('scene-feedback').classList.remove('is-visible');feedbackRemaining=0;},feedbackRemaining);}else $('scene-feedback').classList.remove('is-visible');if(pausedPointerReleased&&drag?.type==='use'){finishCurrentStroke();setToolActive(false);drag=null;shearsClosed=false;}pausedPointerReleased=false;if(audioContext?.state==='suspended'&&soundOn)audioContext.resume().catch(()=>{});if(toolActive)startToolMotor();$('pause-menu').hidden=true;canvas.focus({preventScroll:true});scheduleRender();}
  function retryCurrentStep(){if(mode==='free'||currentStep()?.type!=='cut'||!stepHairSnapshot)return;if(toolActive)setToolActive(false);drag=null;shearsClosed=false;strokeInfo=null;hairField.set(stepHairSnapshot);hairDirty=true;clippings.length=Math.min(stepClippingSnapshot,clippings.length);clippingsDirty=true;stepRegions.clear();validPasses=0;combReady=false;combPath=[];updateLengthReadout();updateHud();showFeedback('Step reset. Your earlier sections are saved; repeat this technique slowly.');scheduleRender();}
  function openPausePanel(id){$('pause-home').hidden=true;$('pause-controls-panel').hidden=id!=='pause-controls-panel';$('pause-settings-panel').hidden=id!=='pause-settings-panel';$(id)?.focus?.();}
  function bindInterface(){const styleSelect=$('style-select'),freeTarget=$('free-target');GAME.styles.forEach(item=>{const option=document.createElement('option');option.value=item.id;option.textContent=`${item.name} · ${item.level.replace(/^LEVEL \d+ · /,'')}`;styleSelect.append(option);const freeOption=option.cloneNode(true);freeTarget.append(freeOption);});styleSelect.value=style.id;freeTarget.value=style.id;
    for(const [name] of GAME.guards){const button=document.createElement('button');button.type='button';button.dataset.guard=name;button.textContent=name;button.setAttribute('aria-pressed',String(name===guard));button.addEventListener('click',()=>chooseGuard(name));$('guard-options').append(button);}
    document.querySelectorAll('[data-tool]').forEach(button=>button.addEventListener('click',()=>chooseTool(button.dataset.tool)));document.querySelectorAll('[data-lever]').forEach(button=>button.addEventListener('click',()=>chooseLever(button.dataset.lever)));
    document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.mode)));document.querySelectorAll('[data-camera]').forEach(button=>button.addEventListener('click',()=>setCamera(button.dataset.camera)));
    styleSelect.addEventListener('change',()=>{const found=GAME.styles.find(item=>item.id===styleSelect.value);if(found){style=found;freeTarget.value=found.id;initializeCut(found,mode);}});
    $('start-cut').addEventListener('click',()=>mode==='free'?$('free-settings').hidden=false:initializeCut(style,mode));$('show-me').addEventListener('click',showLessonDemo);$('retry-step').addEventListener('click',retryCurrentStep);$('reset-cut').addEventListener('click',()=>initializeCut(style,mode));$('finish-cut').addEventListener('click',openReview);$('pick-up-tool').addEventListener('click',()=>{if(toolHeld){finishCurrentStroke();if(toolActive)setToolActive(false);toolHeld=false;}else toolHeld=true;updateHud();showFeedback(toolHeld?`${capitalize(currentTool)} picked up. Right-click to use it.`:'Tool set down. Pick it up before using it again.');});$('guard-attach').addEventListener('click',()=>{if(currentTool!=='clipper')return;guardAttached=!guardAttached;updateHud();showFeedback(guardAttached?`${guard} guard attached to the clipper.`:'Guard removed. The clipper blade is exposed.');});
    $('pause-game').addEventListener('click',()=>setPaused(true));$('resume-game').addEventListener('click',()=>setPaused(false));$('restart-paused').addEventListener('click',()=>initializeCut(style,mode));$('pause-show-controls').addEventListener('click',()=>openPausePanel('pause-controls-panel'));$('pause-show-settings').addEventListener('click',()=>openPausePanel('pause-settings-panel'));document.querySelectorAll('[data-pause-back]').forEach(button=>button.addEventListener('click',()=>{const fromSettings=!$('pause-settings-panel').hidden;$('pause-controls-panel').hidden=true;$('pause-settings-panel').hidden=true;$('pause-home').hidden=false;(fromSettings?$('pause-show-settings'):$('pause-show-controls')).focus();}));$('quit-selection').addEventListener('click',()=>{setPaused(false);initializeCut(style,mode);styleSelect.focus();styleSelect.scrollIntoView({behavior:'smooth',block:'center'});});$('camera-sensitivity').addEventListener('input',event=>{cameraSensitivity=Number(event.target.value)/1000;});$('pause-sound-toggle').addEventListener('click',()=>{soundOn=!soundOn;$('sound-toggle').setAttribute('aria-pressed',String(soundOn));$('sound-toggle').textContent=soundOn?'Sound on':'Sound off';$('pause-sound-toggle').setAttribute('aria-pressed',String(soundOn));$('pause-sound-toggle').textContent=soundOn?'Sound on':'Sound off';if(soundOn)startToolMotor();else stopToolMotor();});
    $('sound-toggle').addEventListener('click',event=>{soundOn=!soundOn;event.currentTarget.setAttribute('aria-pressed',String(soundOn));event.currentTarget.textContent=soundOn?'Sound on':'Sound off';if(soundOn)startToolMotor();else stopToolMotor();});
    $('shear-length').addEventListener('input',event=>{shearLength=Number(event.target.value);updateHud();});$('comb-ready').addEventListener('click',()=>{if(combReady){combReady=false;combPath=[];hairDirty=true;showFeedback('Comb position cleared. Sweep the comb through the section to position it again.');}else showFeedback('Use the comb on the head first; its path will position the hair for your next pass.',true);updateHud();scheduleRender();});
    $('free-guard').addEventListener('change',event=>chooseGuard(event.target.value));$('start-free').addEventListener('click',()=>{style=GAME.styles.find(item=>item.id===freeTarget.value)||style;styleSelect.value=style.id;initializeCut(style,'free',{shape:$('head-shape').value,length:Number($('starting-length').value),tool:$('free-tool').value,guard:$('free-guard').value});$('free-settings').hidden=true;document.querySelectorAll('[data-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode==='free')));});
    document.querySelectorAll('[data-close-modal]').forEach(button=>button.addEventListener('click',()=>{$('free-settings').hidden=true;}));$('result-again').addEventListener('click',()=>initializeCut(style,mode));$('result-another').addEventListener('click',()=>{$('result-panel').hidden=true;styleSelect.focus();styleSelect.scrollIntoView({behavior:'smooth',block:'center'});});
    $('head-shape').addEventListener('change',event=>{if(mode==='free'){updateHeadShape(event.target.value);hairDirty=true;}});$('shear-length-label').textContent=`${shearLength} mm`;
    canvas.addEventListener('pointerdown',onPointerDown);canvas.addEventListener('pointermove',onPointerMove);canvas.addEventListener('contextmenu',event=>event.preventDefault());canvas.addEventListener('pointerup',onPointerUp);canvas.addEventListener('pointercancel',onPointerUp);canvas.addEventListener('lostpointercapture',onPointerUp);$('barber-stage').addEventListener('contextmenu',event=>event.preventDefault());canvas.addEventListener('wheel',event=>{if(paused)return;event.preventDefault();camera.destination={yaw:camera.yaw,pitch:camera.pitch,radius:clamp((camera.destination?.radius??camera.radius)+Math.sign(event.deltaY)*.16,2.65,4.75)};scheduleRender();},{passive:false});
    canvas.addEventListener('keydown',event=>{if(paused)return;if(event.key==='ArrowLeft'){camera.destination=null;camera.yaw-=.2;event.preventDefault();}else if(event.key==='ArrowRight'){camera.destination=null;camera.yaw+=.2;event.preventDefault();}else if(event.key==='ArrowUp'){camera.destination=null;camera.pitch=clamp(camera.pitch+.08,-.72,1.23);event.preventDefault();}else if(event.key==='ArrowDown'){camera.destination=null;camera.pitch=clamp(camera.pitch-.08,-.72,1.23);event.preventDefault();}scheduleRender();});document.addEventListener('keydown',event=>{const target=event.target;if(event.key==='Escape'){event.preventDefault();setPaused(!paused);return;}if(event.key.toLowerCase()==='p'&&!(target instanceof HTMLElement&&target.matches('input:not([type="range"]),select,textarea,[contenteditable="true"]'))){event.preventDefault();setPaused(!paused);}});window.addEventListener('resize',()=>{hairDirty=true;scheduleRender();});
  }

  const updateHudBase=updateHud;
  updateHud=function(){updateHudBase();const s=currentStep();$('clipper-settings').hidden=currentTool==='trimmer'||!(currentTool==='clipper'||currentTool==='trimmer');$('shear-settings').hidden=!(currentTool==='scissors'||currentTool==='comb'||s?.requiresComb);document.querySelector('.shear-length').hidden=currentTool!=='scissors';if(currentTool==='clipper')$('selected-tool-copy').textContent=`Clipper · guard ${guard} (≈${guardLength(guard)} mm) · lever ${lever}`;else if(currentTool==='trimmer')$('selected-tool-copy').textContent='Trimmer · detail blade';if(mode==='free'){$('coach-title').textContent='Explore and practice';$('coach-copy').textContent='Choose a tool and drag directly across the hair. Each pass changes only the area it touches; orbit the head from the background.';$('coach-meta').textContent=techniqueCue(currentTool,'pass',toolPoint?.region?[toolPoint.region]:[])+' Guard values are approximate.';$('interaction-copy').textContent='Free practice · drag over hair to cut, change tools or settings, then inspect all sides.';}else if(mode==='guided'&&s?.type==='cut'){const setup=s.tool==='clipper'?`Clipper · ${s.guard} · lever ${s.lever}`:s.tool==='scissors'?`Shears · about ${s.shearLength} mm`:capitalize(s.tool);$('coach-copy').textContent=`${s.copy} Suggested setup: ${setup}${s.requiresComb?' · position the comb first':''}.`;$('coach-meta').textContent=techniqueCue(s.tool,s.movement,s.regions);}else if(mode==='challenge'&&s?.type==='cut'){$('coach-copy').textContent='Skill check: choose a tool and setting from memory, then make a controlled pass through each required section.';$('coach-meta').textContent=techniqueCue(s.tool,s.movement,s.regions);}scheduleRender();};
  const updateHudWithPhysicalState=updateHud;
  updateHud=function(){updateHudWithPhysicalState();$('guard-attach').hidden=currentTool!=='clipper';$('guard-attach').disabled=currentTool!=='clipper'||guard==='No guard';$('guard-attach').setAttribute('aria-pressed',String(guardAttached));$('guard-attach').textContent=guard==='No guard'?'No guard selected':guardAttached?`Remove ${guard} guard`:`Attach ${guard}`;$('pick-up-tool').setAttribute('aria-pressed',String(toolHeld));$('pick-up-tool').textContent=toolHeld?`Set down ${capitalize(currentTool)}`:`Pick up ${capitalize(currentTool)}`;if(currentTool==='clipper')$('selected-tool-copy').textContent=`Clipper · ${guardAttached?`${guard} attached`:guard==='No guard'?'no guard':'guard not attached'} · lever ${lever}`;if(currentTool==='trimmer')$('selected-tool-copy').textContent='Trimmer · detail blade';if(!toolHeld){$('interaction-copy').textContent=`${capitalize(currentTool)} is set down. Pick it up before working on the hair.`;$('coach-copy').textContent=`Pick up the ${capitalize(currentTool)} from the workbench, then guide it over the hair.`;}};
  const updateHudWithCompletion=updateHud;
  updateHud=function(){
    updateHudWithCompletion();updateToolStatus();
    const s=currentStep();
    $('retry-step').hidden=mode==='free'||s?.type!=='cut'||finished;
    if(!toolHeld){
      if(mode==='free'){
        $('interaction-copy').textContent=`Pick up ${capitalize(currentTool)} before using it.`;
        $('coach-copy').textContent=`Pick up ${capitalize(currentTool)} from the workbench to begin.`;
      }else if(s?.type==='look'){
        $('interaction-copy').textContent='Use the camera buttons or drag the background to inspect the head.';
        $('coach-copy').textContent=s.copy;
      }else if(s?.type==='cut'){
        const setup=s.tool==='clipper'?`${s.guard} guard · lever ${s.lever}`:s.tool==='scissors'?`about ${s.shearLength} mm`:'';
        $('interaction-copy').textContent=`Pick up ${capitalize(s.tool)} to begin this pass.`;
        $('coach-copy').textContent=`${s.copy} Pick up the ${capitalize(s.tool)}${setup?` (${setup})`:''}; attach the guard if needed, then follow the highlighted section.`;
      }else if(s?.type==='inspect'){
        $('interaction-copy').textContent='Use the camera views to inspect the front, both sides and the back.';
        $('coach-copy').textContent=s.copy;
        $('coach-meta').textContent=s.hint||'Compare the shape, symmetry and outline before opening the review.';
      }else{
        $('interaction-copy').textContent='Review the result, then continue when ready.';
      }
    }else if(currentTool==='clipper'||currentTool==='trimmer'){
      $('interaction-copy').textContent=`Right-click to turn ${currentTool} ${toolActive?'off':'on'} · Move over the head to ${currentTool==='clipper'?'cut':'trim'}.`;
    }else if(currentTool==='razor'){
      $('interaction-copy').textContent='Right-click and drag over the hair to shave; release to stop. The close pass leaves visible stubble.';
    }else if(currentTool==='scissors'){
      $('interaction-copy').textContent='Right-click and move through a section to cut. Comb first for scissor-over-comb in guided lessons.';
    }else if(currentTool==='comb'){
      $('interaction-copy').textContent='Right-click and sweep through the hair to reposition it; then choose shears or clipper-over-comb.';
    }else if(currentTool==='spray'){
      $('interaction-copy').textContent='Right-click and sweep over the head to dampen a working section.';
    }else if(currentTool==='brush'){
      $('interaction-copy').textContent='Right-click and brush around the neckline to clear loose clippings.';
    }
    if(finished){
      $('coach-title').textContent='Session complete';
      $('coach-copy').textContent='Your haircut is ready to review. Rotate the finished head and compare the front, sides and back.';
      $('coach-meta').textContent='Use the session review to see shape, symmetry, blending and control scores.';
      $('interaction-copy').textContent='Rotate the final result, then open the session review.';
    }
  };
  function boot(){bindInterface();loadSkinReferences();loadMakeHumanClient();let challengeUnlocked=false;try{challengeUnlocked=localStorage.getItem('craft-sim-guided-complete')==='1';}catch(_){}const challenge=document.querySelector('[data-mode="challenge"]');if(challengeUnlocked){challenge.disabled=false;challenge.title='Skill check unlocked';challenge.textContent='Skill check';}initializeCut(style,'guided');scheduleRender();}
  boot();
})();

