'use client';

import { useState, useEffect, useRef } from 'react';
import { LOMBOK_LOCATIONS } from '../lib/locations';

interface Props {
  value: string;
  onChange: (v: string) => void;
  style?: React.CSSProperties;
  required?: boolean;
  placeholder?: string;
}

export default function LocationInput({ value, onChange, style, required, placeholder = 'Type to search…' }: Props) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync when parent resets (e.g. form load)
  useEffect(() => { setQuery(value); }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        // Revert if typed value isn't a valid location
        if (!LOMBOK_LOCATIONS.includes(query as any)) setQuery(value);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [query, value]);

  const filtered = query.trim() === ''
    ? LOMBOK_LOCATIONS.slice()
    : LOMBOK_LOCATIONS.filter(l => l.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (loc: string) => {
    setQuery(loc);
    onChange(loc);
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
  };

  const handleFocus = () => setOpen(true);

  const baseInput: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1.5px solid #DDD6C8',
    fontSize: 15,
    outline: 'none',
    background: '#FDFAF5',
    fontFamily: 'inherit',
    color: '#2F2A26',
    boxSizing: 'border-box',
    ...style,
  };

  const dropdown: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    background: '#FDFAF5',
    border: '1.5px solid #DDD6C8',
    borderRadius: 10,
    boxShadow: '0 8px 24px rgba(47,42,38,0.12)',
    zIndex: 100,
    maxHeight: 220,
    overflowY: 'auto',
  };

  const item: React.CSSProperties = {
    padding: '10px 14px',
    fontSize: 14,
    color: '#2F2A26',
    cursor: 'pointer',
    borderBottom: '1px solid #F0E8DC',
  };

  const itemHover: React.CSSProperties = {
    ...item,
    background: '#F0E8DC',
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        style={baseInput}
      />
      {open && filtered.length > 0 && (
        <div style={dropdown}>
          {filtered.map(loc => (
            <SuggestionItem key={loc} loc={loc} onSelect={handleSelect} item={item} itemHover={itemHover} />
          ))}
        </div>
      )}
      {open && filtered.length === 0 && (
        <div style={dropdown}>
          <div style={{ padding: '10px 14px', fontSize: 13, color: '#6F6A64' }}>No location found</div>
        </div>
      )}
    </div>
  );
}

function SuggestionItem({ loc, onSelect, item, itemHover }: {
  loc: string;
  onSelect: (l: string) => void;
  item: React.CSSProperties;
  itemHover: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={hovered ? itemHover : item}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={() => onSelect(loc)} // mouseDown before blur fires
    >
      {loc}
    </div>
  );
}
