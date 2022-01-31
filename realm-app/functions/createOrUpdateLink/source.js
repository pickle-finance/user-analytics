exports = async function (input) {
    const { url, hash, shortLinks } = input;

    const db = context.services.get("mongodb-atlas").db("data");
    const linksCollection = db.collection("links");
    const shortLinksCollection = db.collection("shortLinks");

    const shortLinkId = await shortLinksCollection.insertOne({
        ...shortLinks.create[0],
        link: hash
    }).then(result => result.insertedId);


    const link = await linksCollection.findOneAndUpdate(
        { url, hash },
        {
            "$setOnInsert": {
                url,
                hash,
            },
            "$addToSet": {
                "shortLinks": shortLinkId
            },
        },
        { upsert: true, returnNewDocument: true }
    );

    return link;
};