import React from 'react';

export default function LatestBook({latest}) {
  return(
    <section className="latest">
      <h2>Latest Release</h2>
      <h3>{latest.title}</h3>
      <p></p>
    </section>
  )
}