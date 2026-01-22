import React from 'react'

function Footer() {
  return (
    <>
      {/* Footer */}
        <footer className="py-8 bg-card border-t border-border">
          <div className="container mx-auto px-4 text-center text-muted-foreground text-sm font-medium">
            <img src="/logo-carepath.png" alt="Logo Care Path" width={'250px'} className='mx-auto mb-1'/>
            <p>© 2025 CarePath. All rights reserved. Your health data is secure and private.</p>
          </div>
        </footer>
    </>
  )
}

export default Footer