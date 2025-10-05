import * as me from 'melonjs';
import PlayScreen from './js/stage/play.js';
import { resources } from './resources.js';
import RoomScreen from './js/stage/room.js';

me.device.onReady(() => {
  me.video.init(960, 540, { parent: 'screen', scaleMethod: 'flex', renderer: me.video.AUTO });

  me.loader.preload(resources, () => {
    me.state.set(me.state.PLAY, new PlayScreen());
    me.state.set(me.state.ROOM, new RoomScreen());
    me.state.change(me.state.PLAY);
  });
});
