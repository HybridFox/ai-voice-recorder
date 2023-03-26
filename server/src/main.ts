import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bodyParser: false,
	});
	(app as any).useBodyParser('json', { limit: '100mb' });
	app.setGlobalPrefix('/api/v1');
	await app.listen(process.env.PORT);
}
bootstrap();
