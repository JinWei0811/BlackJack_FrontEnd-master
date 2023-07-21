export class connectRequest {
  name: string;
  method: string;
  roomId: string;
}

export class connectResponse {
  roomId: string;
  playerList: string[];
  playerStateList: string[];
  content: string;
  method: string;
}

export class gameResponse {
  method: string;
  name: string;
  suits: string[];
  ranks: string[];
  state: string;
  points: number;
}
