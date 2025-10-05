export class SocketNet {
  constructor(url) {
    this.url = url;
    this.sock = null;
    this.uid = null;
    this.cb = null;
  }
  connect({ room = 'main', name = 'Guest', color = '#60a5fa' } = {}) {
    return new Promise((resolve) => {
      this.sock = window.io(this.url, { transports: ['websocket'] });
      this.sock.on('connect', () => {
        this.uid = this.sock.id;
        this.sock.emit('join', { roomId: room, name, color });
        resolve({ uid: this.uid });
      });

      // fan-in to a single callback so your scene can switch on type
      this.sock.on('state:init', (players) => this.cb?.({ type: 'init', players }));
      this.sock.on('player:add', (p) => this.cb?.({ type: 'add', player: p }));
      this.sock.on('player:upd', (p) => this.cb?.({ type: 'upd', player: p }));
      this.sock.on('player:del', (uid) => this.cb?.({ type: 'del', uid }));
    });
  }
  onEvents(cb) {
    this.cb = cb;
  }
  sendState(partial) {
    this.sock?.emit('state', partial);
  }
  disconnect() {
    this.sock?.emit('leave');
    this.sock?.disconnect();
  }
}
