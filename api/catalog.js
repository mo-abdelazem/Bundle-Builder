import catalog from '../src/data/catalog.json' with { type: 'json' };

export default function handler(_req, res) {
  res.status(200).json(catalog);
}
