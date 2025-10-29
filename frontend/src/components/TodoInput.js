import React, { useState } from 'react';
export default function TodoInput({ onAdd }){
const [text,setText]=useState('');
return (
<form onSubmit={(e)=>{ e.preventDefault(); if(!text.trim()) return; onAdd(text); setText(''); }}>
<input value={text} onChange={e=>setText(e.target.value)} placeholder="Add new task" />
<button type="submit">Add</button>
</form>
);
}