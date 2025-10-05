import * as me from 'melonjs';
import PlayScreen from './stage/play.js';
import { resources } from '../resources.js';
import RoomScreen from './stage/room.js';
import ClockOutScreen from './stage/clockout.js';

export async function startGame() {
  me.video.init(960, 540, { parent: 'screen', scaleMethod: 'flex', renderer: me.video.AUTO });
    
  me.loader.preload(resources, () => {
    me.state.set(me.state.PLAY, new PlayScreen());
    //me.state.set(me.state.ROOM, new RoomScreen());
    me.state.set(me.state.CLOCKOUT, new ClockOutScreen());
    me.state.change(me.state.PLAY);
  });
}
