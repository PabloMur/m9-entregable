import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID as any,
  process.env.ALGOLIA_API_KEY as any
);

export const algoliaDB = client.initIndex("ecommerce-m9");
