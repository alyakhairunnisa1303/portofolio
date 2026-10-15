<!-- SECTION 4: INTERACTIVE GUESTBOOK / "LEAVE A NOTE" -->
    <section id="guestbook" class="scrapbook-section section-guestbook">
      <div class="section-container">
        
        <div class="guestbook-header">
          <div class="script-subtitle">Virtual Scrapbook Corkboard</div>
          <h2 class="calligraphy-title-section">Leave a Sweet Note 💌</h2>
          <p class="guestbook-sub">Say hello, drop tech feedback, or discuss engineering collaboration!</p>
        </div>

        <div class="corkboard-wrapper">
          <!-- Form to stick a new note -->
          <div class="leave-note-card">
            <div class="washi-tape tape-pink tape-center"></div>
            <h3>Stick Your Note 📌</h3>
            <form id="guestbook-form" class="note-form">
              <div class="form-group">
                <label for="visitor-name">Your Name / GitHub Handle:</label>
                <input type="text" id="visitor-name" placeholder="e.g. Maya or @frontend_dev" required maxlength="30">
              </div>

              <div class="form-group">
                <label for="visitor-msg">Your Message:</label>
                <textarea id="visitor-msg" rows="3" placeholder="Drop an encouraging word, clean code appreciation, or project idea..." required maxlength="180"></textarea>
              </div>

              <div class="form-group sticker-picker-group">
                <label>Choose a sticker pin:</label>
                <div class="sticker-selector" id="sticker-selector">
                  <label class="radio-pill active"><input type="radio" name="pin-icon" value="🌸" checked> 🌸 Blossom</label>
                  <label class="radio-pill"><input type="radio" name="pin-icon" value="💻"> 💻 Laptop</label>
                  <label class="radio-pill"><input type="radio" name="pin-icon" value="✨"> ✨ Sparkle</label>
                  <label class="radio-pill"><input type="radio" name="pin-icon" value="🍵"> 🍵 Matcha</label>
                  <label class="radio-pill"><input type="radio" name="pin-icon" value="⚡"> ⚡ Lightning</label>
                </div>
              </div>

              <button type="submit" class="submit-note-btn">
                <span>📌 Pin to Corkboard</span>
              </button>
            </form>
          </div>

          <!-- The Corkboard Grid with Sticky Notes -->
          <div class="corkboard-notes" id="corkboard-notes">
            
            <!-- Default Sample Notes (Tech & Dev Flavored) -->
            

          </div>
        </div>

      </div>
    </section>
  