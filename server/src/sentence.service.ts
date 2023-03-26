import { Injectable } from '@nestjs/common';
import * as asyncFs from 'fs/promises';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SentenceService {
	private sentences: string[] = [];

	public async loadSentences(locale: string): Promise<void> {
		const sentenceFile = await asyncFs.readFile(
			path.join(__dirname, `../src/locales/${locale}.txt`),
			'utf-8',
		);

		this.sentences = sentenceFile.split('\n');
	}

	getRandomSentence(): { id: number; sentence: string } {
		const id = Math.ceil(Math.random() * this.sentences.length);
		const sentence = this.sentences[id];

		return {
			id,
			sentence,
		};
	}

	async saveSentence(
		id: number,
		body: Buffer,
	): Promise<{ id: number; sentence: string }> {
		const sentence = this.sentences[id];

		fs.createWriteStream(
			path.join(__dirname, `../uploads/${id}.wav`),
			'utf-8',
		).write(body);
		fs.createWriteStream(
			path.join(__dirname, `../uploads/${id}.normalized.txt`),
			'utf-8',
		).write(sentence);

		return {
			id,
			sentence,
		};
	}
}
