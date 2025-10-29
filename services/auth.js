import axios from 'axios';
import { log } from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

export async function getAccessToken() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const pair = `${clientId}:${clientSecret}`;
  const base64 = Buffer.from(pair).toString('base64');
  const authHeader = `Basic ${base64}`;

  const url = 'https://oauth2.quran.foundation/oauth2/token';
  const headers = {
    'Authorization': authHeader,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'content',
  });

  try {
    log('🔐 Requesting access token...');
    const res = await axios.post(url, body.toString(), { headers });
    const token = res.data.access_token;
    log('✅ Access token received.');
    return token;
  } catch (err) {
    log('❌ Failed to get access token:', err.response?.data || err.message);
    throw err;
  }
}