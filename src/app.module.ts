import { Module } from "@nestjs/common";
import { TrackModule } from './track/track.module';
import { MongooseModule } from "@nestjs/mongoose";
import { FileModule } from "./file/file.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from 'path'

@Module({
controllers: [],
providers: [],
imports: [
    TrackModule,
    FileModule,
    ServeStaticModule.forRoot({
        rootPath: path.resolve(__dirname, 'static'),
      }),
    MongooseModule.forRoot('mongodb+srv://4abaev:admin@cluster0.3a8fr2w.mongodb.net/music?retryWrites=true&w=majority')
]
})
export class AppModule {}
