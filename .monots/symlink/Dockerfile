# base node image
FROM node:16-bullseye-slim

ENV NODE_ENV production
ENV PNPM_HOME="${HOME}/.pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /monorepo

# Copy the monorepo into the working directory
COPY ./ ./

# Enable corepack (which enables `pnpm`) and install packages
RUN corepack enable
RUN pnpm install --frozen-lockfile


# Build the website
RUN pnpm build:kickjump.com

# Launch the website
CMD ["pnpm", "start:kickjump.com"]
