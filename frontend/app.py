import streamlit as st
import requests

st.set_page_config(
    page_title="AI PR Reviewer",
    page_icon="🤖",
    layout="wide"
)

st.title("🤖 AI GitHub PR Reviewer")
st.markdown(
    "Review GitHub Pull Requests using AI"
)

pr_url = st.text_input(
    "Enter GitHub Pull Request URL"
)

if st.button("Review PR"):

    if not pr_url:
        st.warning("Please enter a PR URL")

    else:

        with st.spinner("Analyzing Pull Request..."):

            try:
                # Fetch PR Details
                details_response = requests.get(
                    "http://127.0.0.1:8000/pr-details",
                    params={"pr_url": pr_url}
                )

                details_data = details_response.json()

                if details_data.get("success"):

                    pr = details_data["data"]

                    st.subheader("📌 Pull Request Details")

                    col1, col2 = st.columns(2)

                    with col1:
                        st.metric("Author", pr["author"])

                    with col2:
                        st.metric(
                            "Changed Files",
                            pr["changed_files"]
                        )

                    st.info(
                        f"**Title:** {pr['title']}"
                    )

                    st.success(
                        f"State: {pr['state']}"
                    )

                # AI Review
                ai_response = requests.get(
                    "http://127.0.0.1:8000/ai-review",
                    params={"pr_url": pr_url}
                )

                ai_review = ai_response.json()

                st.subheader("🧠 AI Review")

                st.json(ai_review)

            except Exception as e:
                st.error(f"Error: {e}")