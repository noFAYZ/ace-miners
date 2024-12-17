export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).send({ message: "Something went wrong" });
    }
    let data

    try {

        const response = await fetch(
            "https://api.f2pool.com/kadena/aceminers",
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

    }



    return res.status(200).json(JSON.stringify(data));
}
