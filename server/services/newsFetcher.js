const axios = require('axios');
const CrisisEvent = require('../models/CrisisEvent');

const KEYWORDS = [
  { term: 'famine OR food shortage OR starvation',     type: 'famine'   },
  { term: 'armed conflict OR war OR military attack',  type: 'conflict' },
  { term: 'disease outbreak OR epidemic OR cholera',   type: 'disease'  },
  { term: 'flood OR earthquake OR cyclone disaster',   type: 'disaster' },
  { term: 'economic collapse OR hyperinflation crisis',type: 'economic' },
];

const countryMap = {
  'ukraine':        { code: 'UA', region: 'Eastern Europe'   },
  'ethiopia':       { code: 'ET', region: 'East Africa'      },
  'pakistan':       { code: 'PK', region: 'South Asia'       },
  'nigeria':        { code: 'NG', region: 'West Africa'      },
  'venezuela':      { code: 'VE', region: 'South America'    },
  'syria':          { code: 'SY', region: 'Middle East'      },
  'somalia':        { code: 'SO', region: 'East Africa'      },
  'afghanistan':    { code: 'AF', region: 'Central Asia'     },
  'myanmar':        { code: 'MM', region: 'Southeast Asia'   },
  'sudan':          { code: 'SD', region: 'North Africa'     },
  'haiti':          { code: 'HT', region: 'Caribbean'        },
  'yemen':          { code: 'YE', region: 'Middle East'      },
  'congo':          { code: 'CD', region: 'Central Africa'   },
  'mali':           { code: 'ML', region: 'West Africa'      },
  'iraq':           { code: 'IQ', region: 'Middle East'      },
  'libya':          { code: 'LY', region: 'North Africa'     },
  'zimbabwe':       { code: 'ZW', region: 'Southern Africa'  },
  'mozambique':     { code: 'MZ', region: 'Southern Africa'  },
  'south sudan':    { code: 'SS', region: 'East Africa'      },
  'india':          { code: 'IN', region: 'South Asia'       },
  'bangladesh':     { code: 'BD', region: 'South Asia'       },
  'iran':           { code: 'IR', region: 'Middle East'      },
  'turkey':         { code: 'TR', region: 'Middle East'      },
  'kenya':          { code: 'KE', region: 'East Africa'      },
  'ghana':          { code: 'GH', region: 'West Africa'      },
  'zimbabwe':       { code: 'ZW', region: 'Southern Africa'  },
  'brazil':         { code: 'BR', region: 'South America'    },
  'mexico':         { code: 'MX', region: 'North America'    },
  'colombia':       { code: 'CO', region: 'South America'    },
  'indonesia':      { code: 'ID', region: 'Southeast Asia'   },
  'philippines':    { code: 'PH', region: 'Southeast Asia'   },
  'cambodia':       { code: 'KH', region: 'Southeast Asia'   },
  'laos':           { code: 'LA', region: 'Southeast Asia'   },
  'thailand':       { code: 'TH', region: 'Southeast Asia'   },
  'russia':         { code: 'RU', region: 'Eastern Europe'   },
  'china':          { code: 'CN', region: 'East Asia'        },
  'north korea':    { code: 'KP', region: 'East Asia'        },
  'south africa':   { code: 'ZA', region: 'Southern Africa'  },
  'egypt':          { code: 'EG', region: 'North Africa'     },
  'algeria':        { code: 'DZ', region: 'North Africa'     },
  'morocco':        { code: 'MA', region: 'North Africa'     },
  'tunisia':        { code: 'TN', region: 'North Africa'     },
  'senegal':        { code: 'SN', region: 'West Africa'      },
  'cameroon':       { code: 'CM', region: 'Central Africa'   },
  'chad':           { code: 'TD', region: 'Central Africa'   },
  'niger':          { code: 'NE', region: 'West Africa'      },
  'burkina faso':   { code: 'BF', region: 'West Africa'      },
  'guinea':         { code: 'GN', region: 'West Africa'      },
  'sierra leone':   { code: 'SL', region: 'West Africa'      },
  'liberia':        { code: 'LR', region: 'West Africa'      },
  'côte d\'ivoire': { code: 'CI', region: 'West Africa'      },
  'ivory coast':    { code: 'CI', region: 'West Africa'      },
  'togo':           { code: 'TG', region: 'West Africa'      },
  'benin':          { code: 'BJ', region: 'West Africa'      },
  'tanzania':       { code: 'TZ', region: 'East Africa'      },
  'uganda':         { code: 'UG', region: 'East Africa'      },
  'rwanda':         { code: 'RW', region: 'East Africa'      },
  'burundi':        { code: 'BI', region: 'East Africa'      },
  'malawi':         { code: 'MW', region: 'Southern Africa'  },
  'zambia':         { code: 'ZM', region: 'Southern Africa'  },
  'angola':         { code: 'AO', region: 'Southern Africa'  },
  'namibia':        { code: 'NA', region: 'Southern Africa'  },
  'botswana':       { code: 'BW', region: 'Southern Africa'  },
  'israel':         { code: 'IL', region: 'Middle East'      },
  'palestine':      { code: 'PS', region: 'Middle East'      },
  'gaza':           { code: 'PS', region: 'Middle East'      },
  'lebanon':        { code: 'LB', region: 'Middle East'      },
  'jordan':         { code: 'JO', region: 'Middle East'      },
  'saudi arabia':   { code: 'SA', region: 'Middle East'      },
  'qatar':          { code: 'QA', region: 'Middle East'      },
  'kuwait':         { code: 'KW', region: 'Middle East'      },
  'bahrain':        { code: 'BH', region: 'Middle East'      },
  'oman':           { code: 'OM', region: 'Middle East'      },
  'uzbekistan':     { code: 'UZ', region: 'Central Asia'     },
  'tajikistan':     { code: 'TJ', region: 'Central Asia'     },
  'kyrgyzstan':     { code: 'KG', region: 'Central Asia'     },
  'turkmenistan':   { code: 'TM', region: 'Central Asia'     },
  'kazakhstan':     { code: 'KZ', region: 'Central Asia'     },
  'nepal':          { code: 'NP', region: 'South Asia'       },
  'sri lanka':      { code: 'LK', region: 'South Asia'       },
  'myanmar':        { code: 'MM', region: 'Southeast Asia'   },
  'vietnam':        { code: 'VN', region: 'Southeast Asia'   },
  'peru':           { code: 'PE', region: 'South America'    },
  'bolivia':        { code: 'BO', region: 'South America'    },
  'ecuador':        { code: 'EC', region: 'South America'    },
  'paraguay':       { code: 'PY', region: 'South America'    },
  'uruguay':        { code: 'UY', region: 'South America'    },
  'argentina':      { code: 'AR', region: 'South America'    },
  'chile':          { code: 'CL', region: 'South America'    },
  'cuba':           { code: 'CU', region: 'Caribbean'        },
  'dominican':      { code: 'DO', region: 'Caribbean'        },
  'jamaica':        { code: 'JM', region: 'Caribbean'        },
  'honduras':       { code: 'HN', region: 'Central America'  },
  'guatemala':      { code: 'GT', region: 'Central America'  },
  'el salvador':    { code: 'SV', region: 'Central America'  },
  'nicaragua':      { code: 'NI', region: 'Central America'  },
  'costa rica':     { code: 'CR', region: 'Central America'  },
  'panama':         { code: 'PA', region: 'Central America'  },
};
function detectCountry(text) {
  const lower = text.toLowerCase();
  for (const [country, info] of Object.entries(countryMap)) {
    if (lower.includes(country)) return info;
  }
  return { code: 'WW', region: 'Global' };
}

function estimateSeverity(text) {
  const lower = text.toLowerCase();
  if (lower.includes('million') || lower.includes('catastrophic') || lower.includes('critical')) return 9;
  if (lower.includes('thousand') || lower.includes('severe')      || lower.includes('major'))    return 7;
  return 5;
}

async function fetchLiveNews() {
  console.log('Fetching live crisis news...');
  let added = 0;

  for (const kw of KEYWORDS) {
    try {
      const res = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q:        kw.term,
          language: 'en',
          sortBy:   'publishedAt',
          pageSize: 5,
          apiKey:   process.env.NEWS_API_KEY,
        },
      });

      for (const article of res.data.articles) {
        if (!article.title || article.title === '[Removed]') continue;

        const text    = `${article.title} ${article.description || ''}`;
        const country = detectCountry(text);

        // avoid duplicates
        const exists = await CrisisEvent.findOne({ title: article.title });
        if (exists) continue;

        await CrisisEvent.create({
          region:      country.region,
          countryCode: country.code,
          type:        kw.type,
          title:       article.title.slice(0, 120),
          description: article.description?.slice(0, 250) || 'No description available',
          severity:    estimateSeverity(text),
          source:      article.source?.name || 'NewsAPI',
          eventDate:   new Date(article.publishedAt),
        });
        added++;
      }
    } catch (err) {
      console.log(`Error fetching ${kw.type}:`, err.message);
    }
  }
  console.log(` Added ${added} new live crisis events`);
}

module.exports = fetchLiveNews;