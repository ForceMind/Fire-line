// Fire-line 局域网 WebSocket 后端服务器
// 依赖：npm install ws

const WebSocket = require('ws');
const os = require('os');
const PORT = 3000;

const wss = new WebSocket.Server({ port: PORT });

// 房间与玩家管理
let rooms = {};
let clients = new Map(); // ws => {roomId, playerId, name}

function broadcastRoomList() {
  const list = Object.values(rooms).map(r => ({ id: r.id, name: r.name, players: r.players.length }));
  const msg = JSON.stringify({ type: 'roomList', rooms: list });
  wss.clients.forEach(ws => { if (ws.readyState === WebSocket.OPEN) ws.send(msg); });
}

function sendToRoom(roomId, data, exceptWs) {
  const room = rooms[roomId];
  if (!room) return;
  room.players.forEach(p => {
    if (p.ws !== exceptWs && p.ws.readyState === WebSocket.OPEN) {
      p.ws.send(JSON.stringify(data));
    }
  });
}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    let msg;
    try { msg = JSON.parse(message); } catch { return; }
    if (msg.type === 'getRooms') {
      // 主动请求房间列表
      broadcastRoomList();
    } else if (msg.type === 'createRoom') {
      // 创建房间
      const roomId = 'room_' + Date.now();
      rooms[roomId] = { id: roomId, name: msg.name || '新房间', players: [] };
      clients.set(ws, { roomId, playerId: msg.playerId, name: msg.name });
      rooms[roomId].players.push({ ws, playerId: msg.playerId, name: msg.name });
      ws.send(JSON.stringify({ type: 'roomCreated', roomId }));
      broadcastRoomList();
    } else if (msg.type === 'joinRoom') {
      // 加入房间
      const room = rooms[msg.roomId];
      if (!room) return ws.send(JSON.stringify({ type: 'error', msg: '房间不存在' }));
      clients.set(ws, { roomId: msg.roomId, playerId: msg.playerId, name: msg.name });
      room.players.push({ ws, playerId: msg.playerId, name: msg.name });
      ws.send(JSON.stringify({ type: 'joined', roomId: msg.roomId }));
      sendToRoom(msg.roomId, { type: 'playerJoin', playerId: msg.playerId, name: msg.name }, ws);
      broadcastRoomList();
    } else if (msg.type === 'leaveRoom') {
      // 离开房间
      const info = clients.get(ws);
      if (info && rooms[info.roomId]) {
        rooms[info.roomId].players = rooms[info.roomId].players.filter(p => p.ws !== ws);
        sendToRoom(info.roomId, { type: 'playerLeave', playerId: info.playerId }, ws);
        if (rooms[info.roomId].players.length === 0) delete rooms[info.roomId];
        broadcastRoomList();
      }
      clients.delete(ws);
    } else if (msg.type === 'sync') {
      // 游戏状态同步
      const info = clients.get(ws);
      if (info && rooms[info.roomId]) {
        sendToRoom(info.roomId, { type: 'sync', playerId: info.playerId, data: msg.data }, ws);
      }
    }
  });
  ws.on('close', function() {
    const info = clients.get(ws);
    if (info && rooms[info.roomId]) {
      rooms[info.roomId].players = rooms[info.roomId].players.filter(p => p.ws !== ws);
      sendToRoom(info.roomId, { type: 'playerLeave', playerId: info.playerId }, ws);
      if (rooms[info.roomId].players.length === 0) delete rooms[info.roomId];
      broadcastRoomList();
    }
    clients.delete(ws);
  });
  // 初始推送房间列表
  broadcastRoomList();
});

console.log('Fire-line 局域网服务器已启动，端口:', PORT);
console.log('本机IP地址：');
Object.values(os.networkInterfaces()).forEach(list => {
  list.forEach(i => { if(i.family==='IPv4'&&!i.internal) console.log('  ws://'+i.address+':'+PORT); });
});
