const { Prisma } = require('@prisma/client');

const claimData = [
    {
        nftId: 1021,
        isClaimed: true,
        dropId: 1,
        ethAddress: "0x664250876c9d9acC92AF91427cC0114a9a22B067",
        kdaWallet: "k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94",
        ltcWallet: "LczKkt4HnPBdyN3ze5QHn2z862X1hwUUBN",
        ckbWallet: "ckt1qyqyph8v9mcllw8sc6ct3lqax3a8vwx6cyqspmu8m3",
        aceMinersContractAddress: "0x4d08d958627729869eDf71B9406d4967F74fC52D",
    },
    {
        nftId: 1023,
        isClaimed: true,
        dropId: 1,
        ethAddress: "0x664250876c9d9acC92AF91427cC0114a9a22B067",
        kdaWallet: "k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94",
        ltcWallet: "LczKkt4HnPBdyN3ze5QHn2z862X1hwUUBN",
        ckbWallet: "ckt1qyqyph8v9mcllw8sc6ct3lqax3a8vwx6cyqspmu8m3",
        aceMinersContractAddress: "0x4d08d958627729869eDf71B9406d4967F74fC52D",
    },

];

const blacklistData = [
    {
        name: 'Cool helmet.',
        description: 'A nice helmet to wear on your head',
        price: new Prisma.Decimal(19.95),
        image: '/images/helmet.jpg',
        category_id: 1,
    },
    {
        name: 'Grey T-Shirt',
        description: 'A nice shirt that you can wear on your body',
        price: new Prisma.Decimal(22.95),
        image: '/images/shirt.jpg',
        category_id: 3,
    },
    {
        name: 'Socks',
        description: 'Cool socks that you can wear on your feet',
        price: new Prisma.Decimal(12.95),
        image: '/images/socks.jpg',
        category_id: 2,
    },
    {
        name: 'Sweatshirt',
        description: 'Cool sweatshirt that you can wear on your body',
        price: new Prisma.Decimal(12.95),
        image: '/images/sweatshirt.jpg',
        category_id: 3,
    },
];

module.exports = {
    claimData,
    blacklistData,
};