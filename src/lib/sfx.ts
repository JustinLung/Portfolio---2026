import {
	bindUISFX,
	createUISFX,
	type CueName,
	type PlayOptions,
	type PlayingSFX,
	type UISFXPlayer
} from 'uisfx';

let player: UISFXPlayer | null = null;
let unbind: (() => void) | null = null;

export function initializeSfx(root: Document): () => Promise<void> {
	if (!player) {
		player = createUISFX({
			pack: 'glass',
			volume: 0.7,
			preferences: { key: 'portfolio:sound' }
		});
	}

	unbind?.();
	unbind = bindUISFX(root, { player }).unbind;

	return async () => {
		unbind?.();
		unbind = null;
		await player?.destroy();
		player = null;
	};
}

export function unlockSfx(): Promise<boolean> {
	return player?.unlock() ?? Promise.resolve(false);
}

export function playSfx(cue: CueName, options?: PlayOptions): PlayingSFX | null {
	return player?.play(cue, options) ?? null;
}

export function isSfxEnabled(): boolean {
	return player?.isEnabled() ?? true;
}

export function setSfxEnabled(enabled: boolean): void {
	if (!player) return;

	if (!enabled) player.stopAll();
	player.setEnabled(enabled);
}
