# Gunakan Node.js sebagai base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Salin seluruh source code aplikasi
COPY /app .

# Salin file package.json dan package-lock.json (jika ada)
# COPY /app/package*.json ./

# COPY /app/prisma ./prisma

# Install dependencies
RUN npm install



# Generate Prisma Client (jika menggunakan Prisma)
RUN npx prisma generate

# Tentukan port yang akan digunakan
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
