import mongoose from 'mongoose';
import { Password } from '../services/password.service';

// an interface that describes the properties
// that are required to create a new User
interface UserAttributes {
  email: string;
  password: string;
}

// an interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttributes): UserDoc;
}

// an interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttributes) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
