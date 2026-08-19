/**
 * Wedding Invitation Central Configuration
 * Easy to customize all wedding details from a single location
 */
const weddingConfig = {
  couple: {
    groom: "Huzaifa",
    bride: "Alishba",
    initials: "H & A",
    fullNameGroom: "Huzaifa",
    fullNameBride: "Alishba"
  },
  dates: {
    displayDate: "11.11.32",
    formalDate: "Thursday, November 11, 2032",
    // Target ISO timestamp for live countdown: November 11, 2032 18:00:00
    targetCountdownDate: "2032-11-11T18:00:00",
    rsvpDeadline: "October 15, 2032"
  },
  texts: {
    bismillah: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    tagline1: "Two Souls",
    tagline2: "One destiny",
    tagline3: "A Lifetime written by Allah",
    invitationGreeting: "Dear Friends and Family",
    invitationBody: "Join us for an evening of love, laughter, duas, and unforgettable memories as we begin our forever.",
    countdownHeading: "The Celebration Begins In",
    scheduleHeading: "Schedule of Events",
    locationHeading: "Location",
    dressCodeHeading: "Dress Code",
    dressCodeText: "We kindly ask guests to avoid deep red and maroon attire for the celebration.",
    giftPreferenceHeading: "Gift Preference",
    giftPreferenceText: "Kindly, no boxed gifts please.",
    rsvpHeading: "Confirm Your Attendance",
    rsvpSubtext: "To help us prepare for a joyful celebration, kindly confirm your attendance.",
    closingHeading: "Hope to see you there!",
    closingNames: "Huzaifa and Alishba"
  },
  schedule: [
    { time: "5 PM", title: "Guest Arrival", icon: "rose" },
    { time: "6 PM", title: "Nikkah Ceremony", icon: "diamond" },
    { time: "7 PM", title: "Mocktail Hour", icon: "rose" },
    { time: "8 PM", title: "Dinner", icon: "diamond" },
    { time: "9 PM", title: "Dance", icon: "rose" }
  ],
  venue: {
    name: "Islamic Center of Melville",
    address: "118 Old East Neck Road Melville, NY 11747",
    googleMapsUrl: "https://maps.google.com/?q=Islamic+Center+of+Melville,+118+Old+East+Neck+Rd,+Melville,+NY+11747",
    embedMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.6508930438343!2d-73.41160352358826!3d40.79607627138139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e829fa757f4fc3%3A0x8677c7fcf033dc0b!2sIslamic%20Center%20of%20Melville!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
  },
  assets: {
    envelopeClosed: "public/ChatGPT_Image_Jun_23_2026_04_40_29_PM_4_piptqn.png",
    waxSealHA: "public/wax_seal_ha.jpg",
    floralCorner: "public/noroot.png (1).webp",
    tornPaperTexture: "public/noroot.png.webp",
    heroArch: "public/hero_arch_swans.jpg",
    venueSketch: "public/venue_mosque_sketch.jpg",
    couplePhoto: "public/couple_photo.jpg",
    rsvpWaxSeal: "public/wax_seal_rsvp.jpg",
    musicSrc: "public/19.08.2026_20.12.36_REC.mp4"
  }
};
