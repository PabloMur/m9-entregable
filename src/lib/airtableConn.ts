import Airtable from "airtable";

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY as any,
});

const airtableBase = Airtable.base(process.env.AIRTABLE_BASE as any);

export default airtableBase;
