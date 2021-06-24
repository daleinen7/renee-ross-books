import React from 'react';

export default function Subscribe() {
  return(
    <>
      <h2>Subscribe to our mailing list</h2>
      <ul>
        <li>A chance to win a free Vintage Gothic Romance</li>
        <li>A chance to win a free Renee Ross Book</li>
        <li>Receive news about book releases, discounts, and freebies</li>
      </ul>
      <form action="/success" method="post" netlify-honeypot="bot-field" data-netlify="true" name="contact" >
        <label htmlFor="email">Email</label>
        <input type="text" name="email" placeholder="E-mail address"/>
        <input type="hidden" name="bot-field" />
        <input type="hidden" name="form-name" placeholder="contact" />
        <input className="submitButton" type="submit" value="SIGN UP"/>
      </form>
    </>
  )
}