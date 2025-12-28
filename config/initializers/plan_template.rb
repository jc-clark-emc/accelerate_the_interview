PLAN_TEMPLATE = {
  1 => {
    title: "Day 1 — Define Your Career Preferences",
    description: <<~TEXT,
      Today is all about clarity.

      Before you can land interviews faster, you need to clearly define:
      - What roles you're targeting  
      - What salary range fits your goals  
      - What skills you *must* use in the next job  
      - What non-negotiables you refuse to compromise on  

      This will shape the rest of your 14-day plan and power future matching features.
    TEXT
    fields: [
      {
        key: :target_titles,
        label: "Target Job Titles",
        type: :string_array,
        example: ["Product Manager", "Technical Program Manager", "Strategy Lead"]
      },
      {
        key: :salary_min,
        label: "Minimum Acceptable Salary",
        type: :integer,
        example: 120000
      },
      {
        key: :salary_ideal,
        label: "Ideal Salary Goal",
        type: :integer,
        example: 150000
      },
      {
        key: :work_location,
        label: "Work Location Preference",
        type: :string,
        example: "Remote only"
      },
      {
        key: :max_commute,
        label: "Maximum Commute Time (minutes)",
        type: :integer,
        example: 20
      },
      {
        key: :must_have_skills,
        label: "Skills You MUST Use in Your Next Role",
        type: :string_array,
        example: ["SQL", "API design", "User interviews"]
      },
      {
        key: :nice_to_have_skills,
        label: "Skills That Would Be Nice to Have",
        type: :string_array,
        example: ["AI tools", "Team leadership"]
      },
      {
        key: :non_negotiables,
        label: "Job Non-Negotiables",
        type: :string_array,
        example: ["No on-call", "Supportive culture", "Flexible schedule"]
      },
      {
        key: :role_must_include,
        label: "What Your Role MUST Include",
        type: :text,
        example: "Cross-functional ownership, strategic decision-making, room to grow"
      },
      {
        key: :career_summary,
        label: "Rewrite Your Career Summary",
        type: :text,
        example: "I'm a product-focused technologist who thrives at solving ambiguous problems..."
      }
    ]
  }
}
