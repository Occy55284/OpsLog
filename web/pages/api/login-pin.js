// pages/api/login-pin.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin';

const COOKIE_NAME = 'opslog_session';
const MAX_AGE = 60 * 60 * 12; // 12 hours

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { managerId, pin } = req.body || {};
  if (!managerId || !pin || pin.length !== 6) {
    return res.status(400).json({ message: 'Select your name and enter your 6-digit code.' });
  }

  try {
    const supa = getSupabaseAdmin();
    const { data, error } = await supa
      .from('opslog.managers')
      .select('id, external_id, display_name, site, role, pin_hash, active')
      .eq('external_id', managerId)
      .single();

    if (error || !data || !data.active) {
      return res.status(401).json({ message: 'Incorrect code or inactive account.' });
    }

    const ok = await bcrypt.compare(pin, data.pin_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Incorrect code or inactive account.' });
    }

    const token = jwt.sign(
      { sub: data.id, site: data.site, role: data.role, displayName: data.display_name },
      process.env.JWT_SECRET,
      { expiresIn: MAX_AGE }
    );

    const cookie = serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax',
      maxAge: MAX_AGE,
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}