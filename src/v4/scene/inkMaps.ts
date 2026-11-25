import { DataTexture, HalfFloatType, LinearFilter, Loader, RedFormat, Texture, TextureLoader } from 'three';
import { VIEWBOX } from '../brand/sigPath';
import fullShape from './ink-assets/full.png';
import liteShape from './ink-assets/lite.png';
import fullTime from './ink-assets/full.ink?url';
import liteTime from './ink-assets/lite.ink?url';

type InkMaps = { shape: Texture; time: DataTexture };

export class InkMapLoader extends Loader<InkMaps> {
  load(mode: string, onLoad: (maps: InkMaps) => void, _progress?: unknown, onError?: (error: unknown) => void) {
    const lite = mode === 'lite';
    const loadTime = async () => {
      const response = await fetch(lite ? liteTime : fullTime);
      if (!response.ok || !response.body) throw new Error('Falha ao carregar o mapa de tinta.');
      const stream = response.body.pipeThrough(new DecompressionStream('gzip'));
      const data = new Uint16Array(await new Response(stream).arrayBuffer());
      const width = lite ? 640 : 1024;
      const height = Math.round(width * VIEWBOX.h / VIEWBOX.w);
      const texture = new DataTexture(data, width, height, RedFormat, HalfFloatType);
      texture.magFilter = texture.minFilter = LinearFilter;
      texture.needsUpdate = true;
      return texture;
    };
    Promise.all([new TextureLoader().loadAsync(lite ? liteShape : fullShape), loadTime()])
      .then(([shape, time]) => {
        shape.anisotropy = 8;
        onLoad({ shape, time });
      }).catch(onError);
  }
}
