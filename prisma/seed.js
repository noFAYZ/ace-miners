const { PrismaClient } = require('@prisma/client');
const { claimData, blacklistData } = require('./data.js');
const prisma = new PrismaClient();

const load = async () => {
    try {
        await prisma.claimData.deleteMany();
        console.log('Deleted records in category table');

        await prisma.$queryRaw`ALTER TABLE ClaimData AUTO_INCREMENT = 1`;
        console.log('reset ClaimData auto increment to 1');


        await prisma.claimData.createMany({
            data: claimData,
        });
        console.log('Added category data');

    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};

load();