import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// A schematic, not holdings, weights or performance data.
export function MarketSculpture() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-5,5,4,-4,0.1,50);
    camera.position.set(7,9,12); camera.lookAt(0,0,0);
    scene.add(new THREE.AmbientLight(0xffffff, 2.1));
    const light = new THREE.DirectionalLight(0xffffff, 3.2);
    light.position.set(-4,8,5); light.castShadow = true;
    light.shadow.mapSize.set(1024,1024);
    light.shadow.camera.left=-7; light.shadow.camera.right=7;
    light.shadow.camera.top=7; light.shadow.camera.bottom=-7;
    light.shadow.normalBias = 0.05; scene.add(light);
    const materials = [
      new THREE.MeshStandardMaterial({color:'#242a23',roughness:0.84}),
      new THREE.MeshStandardMaterial({color:'#d9d7c7',roughness:0.9}),
      new THREE.MeshStandardMaterial({color:'#70794c',roughness:0.85}),
    ];
    const geometry = new THREE.BoxGeometry(1,1,1);
    function box(x:number,y:number,z:number,w:number,h:number,d:number,material:number) {
      const mesh = new THREE.Mesh(geometry,materials[material]);
      mesh.position.set(x,y,z); mesh.scale.set(w,h,d);
      mesh.castShadow=true; mesh.receiveShadow=true; scene.add(mesh);
    }
    // Three physical studies: large blocks, a broader mosaic, selected blocks.
    [-2.7,0,2.7].forEach(x=>box(x,-0.3,0,2.35,0.16,3.1,1));
    for(let r=0;r<3;r++) for(let c=0;c<2;c++)
      box(-2.7+(c-.5)*1.04,.32,r*.96-.96,.92,1.08,.84,0);
    for(let r=0;r<4;r++) for(let c=0;c<3;c++) {
      const height = .38+((r+c)%3)*.17;
      box((c-1)*.7,-.22+height/2,r*.71-1.07,.59,height,.59,(r+c)%3===0?0:1);
    }
    for(let r=0;r<3;r++) for(let c=0;c<3;c++)
      if((r+c)%2===0) box(2.7+(c-1)*.68,.13,r*.92-.92,.54,.7,.73,2);
    const floorGeo=new THREE.PlaneGeometry(200,200);
    const floorMat=new THREE.ShadowMaterial({opacity:.15});
    const floor=new THREE.Mesh(floorGeo,floorMat);
    floor.rotation.x=-Math.PI/2; floor.position.y=-.39; floor.receiveShadow=true; scene.add(floor);
    function draw() {
      if (!element) return;
      const {width,height}=element.getBoundingClientRect();
      if(!width||!height) return;
      const halfWidth=4.8; const halfHeight=halfWidth*height/width;
      camera.left=-halfWidth;camera.right=halfWidth;
      camera.top=halfHeight;camera.bottom=-halfHeight;
      camera.updateProjectionMatrix(); renderer.setSize(width,height);renderer.render(scene,camera);
      element.dataset.rendered='true';
    }
    const observer=new ResizeObserver(draw); observer.observe(element); draw();
    const lost=(event:Event)=>{event.preventDefault();element.dataset.rendered='false';};
    const restored=()=>draw();
    renderer.domElement.addEventListener('webglcontextlost',lost);
    renderer.domElement.addEventListener('webglcontextrestored',restored);
    return ()=>{observer.disconnect();renderer.domElement.removeEventListener('webglcontextlost',lost);renderer.domElement.removeEventListener('webglcontextrestored',restored);geometry.dispose();materials.forEach(m=>m.dispose());floorGeo.dispose();floorMat.dispose();renderer.dispose();renderer.domElement.remove();};
  },[]);
  return <figure className="cl-sculpture">
    <div className="cl-sculpture-head"><span>Tři pohledy na americký trh</span><span>Studie 01—03</span></div>
    <div className="cl-sculpture-canvas" ref={host} aria-hidden="true">
      <div className="cl-sculpture-fallback"><span>▦</span><span>▦</span><span>▦</span></div>
    </div>
    <div className="cl-sculpture-labels"><span><b>01 / VOO</b>Velké firmy</span><span><b>02 / VTI</b>Široký trh</span><span><b>03 / SCHD</b>Dividendový výběr</span></div>
    <figcaption>Schematická ilustrace. Počet a velikost dílků nepředstavují složení fondů ani jejich výnos.</figcaption>
  </figure>;
}

