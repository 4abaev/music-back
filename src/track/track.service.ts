import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from './schemas/track.schema';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Model, ObjectId } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileService, FileType } from 'src/file/file.servise';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService,
  ) {}

  async create(createTrackDto: CreateTrackDto, picture, audio): Promise<Track> {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const track = await this.trackModel.create({
      ...createTrackDto,
      listens: 0,
      audio: audioPath,
      picture: picturePath,
    });
    return track;
  }

  async findAll(count = 10, offset = 0): Promise<Track[]> {
    const tracks = await this.trackModel.find().skip(offset).limit(count);
    return tracks;
  }

  async search(query: string): Promise<Track[]> {
    const tracks = await this.trackModel.find({
      name: {$regex: new RegExp(query, 'i')}
    })
    return tracks;
  }

  async findOne(id: ObjectId): Promise<Track> {
    const track = await this.trackModel.findById(id).populate('comments');
    return track;
  }

  async update(id: ObjectId, updateTrackDto: UpdateTrackDto): Promise<Track> {
    await this.trackModel.findByIdAndUpdate(id, updateTrackDto);
    const updatedTrack = await this.trackModel.findById(id);
    return updatedTrack;
  }

  async remove(id: ObjectId): Promise<ObjectId> {
    const track = await this.trackModel.findByIdAndDelete(id);
    return track.id;
  }

  async addComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(createCommentDto.trackId);
    const comment = await this.commentModel.create({ ...createCommentDto });
    track.comments.push(comment._id);
    track.save();
    return comment;
  }

  async listen(id: ObjectId): Promise<void> {
    const track = await this.trackModel.findById(id)
    track.listens += 1
    track.save()
  }
}
