import React from "react";

const Text = () => {
  return (
    <div>
      <div className="text-4xl md:text-6xl font-bold leading-[80px] md:h-[268px] md:justify-start ml-6 mr-8 text-[#171a20] cursor-pointer">
        Find A <span className="text-[#338573]">Job</span> That
        <br />
        <span className="text-[#338573]">Matches</span> Your Passion
      </div>
      <div className="text-lg  text-[#616161] cursor-pointer">
        Hand-picked opportunities to work from home, remotely, freelance,
        full-time, part-time, contract, and internships. I applied for the job
        on the company's website while browsing new opportunities. I think
        you'll find that my attention to detail and strong communication skills
        could help me excel in this role and I'd love to discuss my
        qualifications in more detail.
      </div>
    </div>
  );
};

export default Text;
