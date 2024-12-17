import { google } from "googleapis";

export default async function handler(req, res) {
  // res.status(200).json({ name: 'John Doe' })

  if (req.method !== "GET") {
    return res.status(405).send({ message: "Something went wrong" });
  }

  const body = req.body;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: "aceminersheet@ace-miners.iam.gserviceaccount.com",
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCzyNeU2gp6Mp6a\nehSsSdlAMyNS3I0t+xPelWtUCqdoOkO5B2OSA5dOymBN79xgMjy8QQlazOmwldrk\nVFs0UyM7S/fmpzS6vflVwcGKxP0MnoVoOo6b1+7meg/BW8S103rilCB+fiaMevjB\nwXzH1K/xc3XaLkj5mUCeR0j/4ZuQp/yYxjaGH9ykuQTSSHxU4YpwR3W1Y2NbN6dm\n3whvBqnR31zgCY0MI3y+yBM89x6wsWyHnBK8b/y7jZv0NJlatgqwHJLAeBoQlndI\nMcdNwNqo3++3/4cvojhvr/KwVqyxeQZTEnx5A4wxMQqG5/DyrYshkxblQ9q1wKlq\ncuosqvnHAgMBAAECggEASRLJmQ1Us91OPNCBBZQQkvkWEvBlC7rhFRfbY3HfIEyK\nSTL5JBiEj/hO0266Pnk82XF/yWG/XFBUg3jMB0UBbXEPxjbRBlP/+3zA21P83Hu0\nEqy2WR6X0iLrs3ZGyna2HFEDshY5OeEjqbEotBo9FyEMVk14yMajDpI/2A1Niyok\nxa7O2nJKd4EEu47nYcujI8e+F4QRtMd2tGfsAmIVSca08iuwlXzB1tlTdWQt27fg\naKQfPy1paZ7DRjggq14IjXwJy99VCh88To4j7XKzJajudG5S6rKXf8re02aoeuJR\nG/d5EE3FvhGBsWintqHO3E8SWOgbSN8oJJPKWk1PqQKBgQDwh9IsgPU8j7JcMhfD\nP0TwK9qrqVH/Ksy2xjp0J7IH+Syec7j7kXJ1wyqI/ajwKBf2R0Gq+qsKWqpU2Vql\nWLbizOR4eaK2tkXNEFxftaxnOM7mgPcj/zxC5/qZGEyUSuQnoGdup5Bi6H7Sw3Bq\nKV1peHauluHsz3on6jRh1zrSDwKBgQC/WOCowSp7ZCPPVg2z7mfMW6oP8lu3iG8Y\nvjfQJPZngJ4wi1dImKOvS6jljf60iyYXYFFB1fRl1/mKoOZVIvCIwHKL2E+519Dt\nb5+GA+nVCyBoKwu4DfHLgl76qxP4pHJDNOxnuMp1OROh3A6N9TawDvRG+iWXuOZi\n3X2rYx80yQKBgE79K4Y161MyFW61fJw/4NHGdQ8+kZDsa0HyoyuWBZ8cswxuEGd9\nAkuuBf/q3VnQsN3N1MDjhNvnnlwy7NOz6IteogD2YPsDrLSFFPDRZoaXX0rPO1n0\n7cNDD0bLdgqU9YwV3yG1oXL5yvxH9ljGsMh8KO1420S7dfA5t24SElz9AoGANiMB\nPP2Z9Vs5vnmMWvICsBDnJqfdRyn0tL1ssRkkFdiP6RAjW8jD1t7DJF9uRspvtoFr\nvAK6qO3YDl7DjCbcgvRf9Cz5MY1b8TF5osMMr1f8jTxQjnxzgq6aDLXGarysD1Oz\n5wyjS1MguNS30XYlSN6SQlqXtDt+A07DNXBP7fECgYA/j05YiRy4IynLKQ3VDqbb\nh7pH+3Dz5pNhlpyxfnuw2dSyLPLSIXdIYPadYXxnYVQmjLiGj13uqEEBfWZa/IkU\nG1twGGCxarZFZVEGiWrxZalP0PRUdAyVGTybmCNO7rKsPXRdM8aFD4ZWzUSzyvOj\nybDf9Ak0rTWYV65mmJqv3w==\n-----END PRIVATE KEY-----\n".replace(
            /\\n/g,
            "\n"
          ),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({ auth, version: "v4" });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: "1YRPzJNcHkKmBTZnrAXOhhu3y4YjuMmXuOLaHRbexsuM",
      range: "Payout!A:E",
    });
    console.log(response.data);
    // .append({
    //   spreadsheetId: "1YRPzJNcHkKmBTZnrAXOhhu3y4YjuMmXuOLaHRbexsuM",
    //   range: "A1:D1",
    //   valueInputOption: "USER_ENTERED",
    //   requestBody: {
    //     values: [[body.dateTime, body.ip, body.address, body.hasNFT]],
    //   },
    // });

    return res.status(200).json({ data: response.data });
    // return response.data;
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: "Something went wrong" });
  }
}
