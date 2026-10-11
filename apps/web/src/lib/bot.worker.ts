import { derive, planTurn, type GameRecord } from '@sttt/engine';

/** Plans a bot's whole turn off the main thread so the board never freezes (GDD section 6). */
export interface BotRequest {
	id: number;
	record: GameRecord;
}
export interface BotResponse {
	id: number;
	cells: number[];
}

addEventListener('message', (event: MessageEvent<BotRequest>) => {
	const { id, record } = event.data;
	const state = derive(record);
	const level = state.record.seats[state.currentSeat]?.bot ?? 'greedy';
	const response: BotResponse = { id, cells: planTurn(state, level) };
	postMessage(response);
});
