export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).send({ message: "Something went wrong" });
    }
    let data;
    const { token } = req.query;

    if (token == "ltc") {
        try {

            const response = await fetch(
                "https://powerpool.io/api2/user?apiKey=197c10645ac1422fa4063e20379aa6db",
                {
                    mode: "no-cors",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",

                    },
                }
            );
            data = await response.json();


        } catch (error) {

            console.log(error)

        }
    }

    else if (token == "kda") {
        try {

            const response = await fetch(
                "https://api.f2pool.com/kadena/aceminers",
                {
                    mode: "no-cors",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "F2P-API-SECRET": "yi5cekvgib2zzwpconiuzw5u2o45s4ovw8rc2yeddgy0b1r5r4qcbgimvt2csi0v"
                    },
                }
            );
            data = await response.json();

        } catch (error) {

        }
    }

    else {
        try {

            const response = await fetch(
                "https://api.f2pool.com/nervos/aceminers",
                {
                    mode: "no-cors",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "F2P-API-SECRET": "yi5cekvgib2zzwpconiuzw5u2o45s4ovw8rc2yeddgy0b1r5r4qcbgimvt2csi0v"
                    },
                }
            );
            data = await response.json();

        } catch (error) {

        }
    }





    return res.status(200).json(JSON.stringify(data));
}
