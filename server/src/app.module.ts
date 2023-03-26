import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { RawBodyMiddleware } from './middleware/raw-body.middleware';
import { SentenceService } from './sentence.service';

@Module({
	imports: [],
	controllers: [AppController],
	providers: [SentenceService],
})
export class AppModule {
	public configure(consumer: MiddlewareConsumer): void {
		consumer.apply(RawBodyMiddleware).forRoutes('*');
	}
}
