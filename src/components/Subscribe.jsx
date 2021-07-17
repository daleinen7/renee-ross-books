import React from 'react';
import {
    Card
} from 'react-bootstrap';

export default function Subscribe() {
  return(
    <Card style={{ width: '90%', padding: '10px' }} className="shadow-sm p-3 mb-5 mt-5 bg-info text-dark rounded" border="secondary">
      <Card.Title>
        <h2>
          <center>
            Subscribe to our mailing list
          </center>
        </h2>
      </Card.Title>
        <Card.Text>    
          
          <ul>
            <li>A chance to win a free Vintage Gothic Romance</li>
            <li>A chance to win a free Renee Ross Book</li>
            <li>Receive news about book releases, discounts, and freebies</li>
          </ul>
          <form method="POST" netlify-honeypot="bot-field" data-netlify="true" name="subscribe">
            <label htmlFor="email" style={{ fontWeight: 'bold' }}>Email</label><br />
            <input type="text" name="email" placeholder="E-mail address" style={{ padding: '3px', marginTop: '10px', marginBottom: '10px' }}/><br />
            <input type="hidden" name="bot-field" />
            <input type="hidden" name="form-name" value="contact" />
            <center>
              <input className="submitButton" type="submit" value="SIGN UP" />
            </center>
          </form>
        </Card.Text>
    </Card>
  )
}