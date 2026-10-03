import { useState } from 'react';
import Icon from './Icon.jsx';

// Generic accessible accordion (FAQ + job listings).
export default function Accordion({ items, renderItem }) {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="acc">
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <div className={`acc-item ${open ? 'open' : ''}`} key={item.key}>
            <button
              type="button"
              className="acc-btn"
              aria-expanded={open}
              aria-controls={`${item.key}-panel`}
              onClick={() => setOpenIdx(open ? -1 : i)}
            >
              <span className="acc-q">{item.heading}</span>
              <Icon name="chevronDown" className="acc-icon" />
            </button>
            <div id={`${item.key}-panel`} className="acc-body" role="region">
              <div className="acc-content">{renderItem(item, open)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}