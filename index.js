const express =require('express');
const cors =require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { QUOTES } = require('./quote');
const  dotenv = require('dotenv');
dotenv.config();


const PORT = process.env.PORT || 3000;
const RATE_LIMIT = {
    capacity: 5,
    windowMs: 60 * 1000 ,
    refillRate: 5 / (60 * 1000) 

}

const app = express();

if(process.env.TRUST_PROXY?.toLowerCase()==="true"){
    app.set('trust proxy', true);
}


app.use(cors());
app.use(helmet());

app.use(express.json());

morgan.token("ip",(req)=>req.ip);
app.use(
    morgan(':date[iso] :ip ":method :url" :status :res[content-length] - :response-time ms')
);

const buckets = new Map();

function rateLimiter(req, res, next) {
  const ip = req.ip; 
  const now = Date.now();

  let state = buckets.get(ip);
  if (!state) {
    state = { tokens: RATE_LIMIT.capacity, lastRefill: now };
    buckets.set(ip, state);
  }

 
  const elapsed = now - state.lastRefill;
  if (elapsed > 0) {
    const refill = elapsed * RATE_LIMIT.refillRate;
    state.tokens = Math.min(RATE_LIMIT.capacity, state.tokens + refill);
    state.lastRefill = now;
  }

  if (state.tokens >= 1) {
    state.tokens -= 1;
    return next();
  }

 
  const tokensNeeded = 1 - state.tokens;
  const msUntilNext = Math.ceil(tokensNeeded / RATE_LIMIT.refillRate);
  const seconds = Math.ceil(msUntilNext / 100);

  res.setHeader("Retry-After", String(seconds));
  return res.status(429).json({
    error: `Rate limit exceeded. Try again in ${seconds} seconds.`
  });
}


app.get("/api/quote", rateLimiter, (req, res) => {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  res.status(200).json({ quote });
});


app.get("/health", (req, res) => res.json({ status: "ok" }));


app.listen(PORT, () => {
  console.log(`Quote API listening on http://localhost:${PORT}`);
  if (app.get("trust proxy")) {
    console.log("Trust proxy enabled: using X-Forwarded-For for IPs");
  }
});