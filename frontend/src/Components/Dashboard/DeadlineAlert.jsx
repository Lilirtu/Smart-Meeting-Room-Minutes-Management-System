// src/components/DeadlineAlert.jsx
function DeadlineAlert() {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      flex: '1 1 300px', // Flex-grow, shrink, basis
      maxWidth: '100%',
      boxSizing: 'border-box',
    }}>
      <h3 style={{
        color: '#1a202c',
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '0.75rem',
      }}>
        Deadlines & Submissions
      </h3>

      <ul style={{
        listStyleType: 'disc',
        paddingLeft: '1.25rem',
        color: '#4a5568',
        fontSize: '0.95rem',
        lineHeight: '1.6',
      }}>
        <li>Submit project proposal – June 30</li>
        <li>Team meeting – July 2</li>
        <li>Final report – July 10</li>
      </ul>
    </div>
  );
}

export default DeadlineAlert;
