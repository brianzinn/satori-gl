import { FC, useEffect, useState } from 'react';
import satori from 'satori'
import './App.css';
import { Nullable } from '@babylonjs/core/types';
import { Engine, Scene, useScene } from 'react-babylonjs';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent"; // side-effect for shadow generator
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import '@babylonjs/inspector'
import { Constants } from '@babylonjs/core/Engines/constants';
import { Color4 } from '@babylonjs/core/Maths/math.color';

const Inspector: FC<{ show: boolean }> = ({ show }) => {
  const scene = useScene()
  if (scene) {
    if (show !== false) {
      scene.debugLayer.show()
    } else {
      scene.debugLayer.hide()
    }
  }
  return null
}

// TODO: use these
const JSX_SAMPLES: Record<string, React.ReactNode> = {
  'helloworld': <div style={{ color: 'black', fontSize: 36 }}>hello, world</div>,
  'helloworldtriangle': <div
    style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      fontSize: 32,
      fontWeight: 600,
    }}
  >
    <svg
      width="75"
      viewBox="0 0 75 65"
      fill="#000"
      style={{ margin: '0 75px' }}
    >
      <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
    </svg>
    <div style={{ marginTop: 40 }}>Hello, World</div>
  </div>,
  'cta-tailwind': <div
    style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    }}
  >
    <div tw="bg-gray-50 flex">
      <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
        <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
          <span>Ready to dive in?</span>
          <span tw="text-indigo-600">Start your free trial today.</span>
        </h2>
        <div tw="mt-8 flex md:mt-0">
          <div tw="flex rounded-md shadow">
            <a href="#/" tw="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white">Get started</a>
          </div>
          <div tw="ml-3 flex rounded-md shadow">
            <a href="#/" tw="flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600">Learn more</a>
          </div>
        </div>
      </div>
    </div>
  </div>,
  'vercel': <div
    style={{
      display: 'flex',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      backgroundColor: 'white',
      fontSize: 60,
      letterSpacing: -2,
      fontWeight: 700,
    }}
  >
    <div
      style={{
        display: 'flex',
        padding: '5px 40px',
        width: 'auto',
        textAlign: 'center',
        backgroundImage: 'linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))',
        backgroundClip: 'text',
        // '-webkit-background-clip': 'text',
        color: 'transparent',
      }}
    >
      Develop
    </div>
    <div
      style={{
        padding: '5px 40px',
        width: 'auto',
        textAlign: 'center',
        backgroundImage: 'linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))',
        backgroundClip: 'text',
        // '-webkit-background-clip': 'text',
        color: 'transparent',
      }}
    >
      Preview
    </div>
    <div
      style={{
        padding: '5px 40px',
        width: 'auto',
        textAlign: 'center',
        backgroundImage: 'linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))',
        backgroundClip: 'text',
        // '-webkit-background-clip': 'text',
        color: 'transparent',
      }}
    >
      Ship
    </div>
  </div>
}

function App() {

  const [fontArrayBuffer, setFontArrayBuffer] = useState<Nullable<ArrayBuffer>>(null);
  const [error, setError] = useState('');

  const [imageJSXKey, setImageJSXKey] = useState('helloworldtriangle');

  const [svgData, setSvgData] = useState<Nullable<string>>(null);
  const [svgVersion, setSvgVersion] = useState(0);

  useEffect(() => {
    try {
      fetch(`${process.env.PUBLIC_URL}/fonts/roboto-black-webfont.ttf`)
        .then((response) => {
          response.arrayBuffer().then(arrayBuffer => {
            console.log('font buffer loaded:', arrayBuffer);
            setFontArrayBuffer(arrayBuffer);
          });
        })
    } catch (e: any) {
      console.error(e);
      setError(e.message)
    }
  }, []);

  useEffect(() => {
    if (fontArrayBuffer === null) {
      return;
    }

    console.log('rendering image JSX Key', imageJSXKey);
    (async () => {
      const svg = await satori(
        JSX_SAMPLES[imageJSXKey],
        {
          width: 1024,
          height: 1024,
          fonts: [
            {
              name: 'Roboto',
              data: fontArrayBuffer,
              weight: 400,
              style: 'normal',
            },
          ],
        },
      )

      const svgNewData = `data:image/svg+xml;base64,${window.btoa(svg)}`;
      setSvgData(svgNewData);
      setSvgVersion(prev => prev + 1);
    })();

  }, [fontArrayBuffer, imageJSXKey])

  const onJSXChanged = (newValue: any) => {
    setImageJSXKey(newValue.target.value);
  }

  return (
    <div className="App">
      <div>
        <select onChange={onJSXChanged} defaultValue={imageJSXKey}>
          <option value='helloworld'>Hello World</option>
          <option value='helloworldtriangle'>Hello World Triangle</option>
          <option value='vercel'>Vercel (Develop/Preview/Ship)</option>
          <option value='cta-tailwind'>CTA tailwind</option>
        </select>
      </div>
      {fontArrayBuffer === null &&
        <div>Loading font... {error}</div>
      }
      {fontArrayBuffer !== null &&
        <>
          <div>Roboto font loaded.  Image version: {svgVersion}</div>
          <Engine antialias adaptToDeviceRatio canvasId="babylon-canvas">
            <Scene clearColor={new Color4(0.2, 0.4, 0.75, 1.0)}>
              <Inspector show />
              <freeCamera
                name="camera1"
                position={new Vector3(0, 2, -5)}
                setTarget={[new Vector3(0, 2, 0)]}
              />
              <hemisphericLight
                name="light1"
                intensity={0.7}
                direction={Vector3.Up()}
              />
              <directionalLight
                name="shadow-light"
                setDirectionToTarget={[Vector3.Zero()]}
                direction={Vector3.Zero()}
                position={new Vector3(-40, 30, -40)}
                intensity={0.4}
                shadowMinZ={1}
                shadowMaxZ={2500}
              >
                <shadowGenerator
                  mapSize={1024}
                  useBlurExponentialShadowMap={true}
                  blurKernel={32}
                  shadowCastChildren
                  forceBackFacesOnly={true}
                  depthScale={100}
                  setDarkness={0.75}
                >
                  <plane
                    name="dialog"
                    width={4}
                    height={4}
                    position={new Vector3(0, 0.5, 0)}
                  >
                    <standardMaterial name='plane-mat'>
                      {svgVersion > 1 &&
                        <texture assignTo='diffuseTexture' key={svgVersion} name='svg-texture' url={svgData!} invertY hasAlpha samplingMode={Texture.TRILINEAR_SAMPLINGMODE} format={Constants.TEXTUREFORMAT_RGBA} />
                      }
                    </standardMaterial>
                  </plane>
                </shadowGenerator>
              </directionalLight>
              <ground name="ground1" width={10} height={10} subdivisions={2} receiveShadows={true} />
            </Scene>
          </Engine>
        </>
      }
    </div>
  );
}

export default App;
