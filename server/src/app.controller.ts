import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	RawBodyRequest,
	Req,
} from '@nestjs/common';
import { Request } from 'express';
import { SentenceService } from './sentence.service';

@Controller('prompts')
export class AppController {
	constructor(private readonly sentenceService: SentenceService) {
		this.sentenceService.loadSentences('nl-BE');
	}

	@Get()
	public getRandomSentence(): any {
		return this.sentenceService.getRandomSentence();
	}

	@Post(':promptId')
	public saveSentence(
		@Param('promptId') promptId: string,
		@Req() request: Request,
	): any {
		this.sentenceService.saveSentence(Number(promptId), request.body);
	}
}
