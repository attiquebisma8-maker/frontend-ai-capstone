# AI Workflow Comparison

## Round One: Vague Prompt

Prompt:
"Create a React settings form with validation."

The AI generated a working settings form with validation. It included profile fields, password confirmation, and accessibility features. However, the implementation required more review because requirements such as character limits, accessibility behavior, and validation details were not explicitly requested.

## Round Two: Precise Prompt

The second prompt included exact requirements, field constraints, accessibility instructions, and a verification step.

The generated implementation was more complete and required less manual review. It included:
- Better accessibility with ARIA attributes
- Focus management for invalid fields
- Reusable components
- Separate validation logic
- Bio character counter
- Improved password confirmation behavior

## Comparison

The vague prompt produced a functional result but required more checking.

The precise prompt produced more accurate code, better accessibility, and cleaner organization.

## AI Mistake I Caught

The first implementation lacked some detailed requirements and required manual verification.

## Conclusion

Detailed prompts combined with verification steps produce more reliable and maintainable code than vague prompts.