import { card } from "./card";

export class playerInfo {
    sessionId?: string;
    name?: string;
    state?: string;
    chip?: number;
    hand?: card[];
    point?: number;
}