import { catchErrors } from 'errors';
import { signToken } from 'utils/authToken';
import { User } from 'entities';
import { createEntity, findEntityOrThrow } from 'utils/typeorm';
import { InvalidCredentialsError, EmailAlreadyInUseError } from 'errors';
import createAccount from 'database/createGuestAccount';

export const createGuestAccount = catchErrors(async (_req, res) => {
  const user = await createAccount();
  res.respond({
    authToken: signToken({ sub: user.id }),
  });
});

export const register = catchErrors(async (req, res) => {
  const { name, email, password } = req.body;
  
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new EmailAlreadyInUseError();
  }
  
  const user = await createEntity(User, {
    name,
    email,
    password,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0052cc&color=fff`,
  });
  
  res.respond({
    authToken: signToken({ sub: user.id }),
    user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
  });
});

export const login = catchErrors(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ 
    where: { email },
    select: ['id', 'name', 'email', 'avatarUrl', 'password']
  });
  
  if (!user || !(await user.validatePassword(password))) {
    throw new InvalidCredentialsError();
  }
  
  res.respond({
    authToken: signToken({ sub: user.id }),
    user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
  });
});

export const getCurrentUser = catchErrors(async (req, res) => {
  const user = await findEntityOrThrow(User, req.currentUser.id);
  res.respond({ user });
});
