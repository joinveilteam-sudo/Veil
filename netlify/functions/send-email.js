exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const RESEND_KEY = 're_SADSjc1o_Lvo8uhG6Cjnuo8UTpz9r638L';

  try {
    const { to, hint } = JSON.parse(event.body);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Veil <hello@joinveil.org>',
        to: [to],
        subject: "You've been Veiled. ◐",
        html: `
          <div style="background:#09090f;color:#ede8f0;font-family:'Georgia',serif;max-width:480px;margin:0 auto;padding:3rem 2rem;text-align:center;">
            <p style="font-size:0.65rem;letter-spacing:0.3em;text-transform:uppercase;color:#8a6070;margin-bottom:1.5rem;">Veil · joinveil.org</p>
            <h1 style="font-size:2.5rem;font-weight:300;margin-bottom:1rem;">You've been Veiled.</h1>
            <p style="font-size:1rem;color:#a8a8c0;line-height:1.7;margin-bottom:1.5rem;">Someone is thinking about you. They chose to stay anonymous. For now.</p>
            ${hint ? `<div style="border-left:2px solid #8a6070;padding:0.8rem 1.2rem;margin:1.5rem 0;text-align:left;font-style:italic;color:#a8a8c0;font-size:0.9rem;">"${hint}"</div>` : ''}
            <a href="https://joinveil.org" style="display:inline-block;background:#c9a4b2;color:#0d0814;padding:0.9rem 2rem;text-decoration:none;font-size:0.75rem;letter-spacing:0.2em;text-transform:uppercase;margin-top:1rem;">Open your Veil</a>
            <p style="font-size:0.62rem;color:#5a5a72;margin-top:2rem;line-height:1.8;">Chat opens for 24 hours after you respond. No archive. No trace. No usernames. joinveil.org</p>
          </div>`
      })
    });

    if (response.ok) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } else {
      const err = await response.text();
      return { statusCode: 500, body: JSON.stringify({ error: err }) };
    }
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
