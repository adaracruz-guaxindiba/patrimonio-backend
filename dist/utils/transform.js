export const transformDocument = (doc) => {
    if (!doc)
        return doc;
    const obj = doc.toObject ? doc.toObject() : doc;
    return {
        ...obj,
        _id: obj._id.toString(), // Manter _id como string
        id: obj._id.toString(), // Também criar campo id para compatibilidade
        createdAt: obj.createdAt?.toISOString() || obj.createdAt,
        updatedAt: obj.updatedAt?.toISOString() || obj.updatedAt,
        __v: undefined
    };
};
export const transformDocuments = (docs) => {
    return docs.map(transformDocument);
};
