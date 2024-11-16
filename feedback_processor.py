import os
import pandas as pd
import json
from groq import Groq
from typing import List, Dict
from flask import Blueprint

# Create a blueprint
feedback_processor_bp = Blueprint('feedback_processor', __name__)

class FeedbackProcessor:
    def __init__(self, api_key: str):
        # Initialize the Groq client with the API key
        self.client = Groq(api_key=api_key)

    @feedback_processor_bp.route('/process_feedback', methods=['POST'])
    def process_startup_feedback(self, startup_data: Dict, judge_feedback: List[Dict]) -> Dict:
        """
        Process feedback for a single startup using Groq (formerly Claude)
        """
        # Aggregate feedback and scores
        aggregated_feedback = self._aggregate_feedback(judge_feedback)
        
        # Prepare prompt for Groq
        prompt = self._create_analysis_prompt(startup_data, aggregated_feedback)
        
        # Get analysis from Groq
        response = self.client.chat.completions.create(
            model="llama3-8b-8192",  # Adjust the model as needed for Groq
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        # Structure the response
        analysis = self._structure_response(response.choices[0].message.content)
        
        return {
            "startup_name": startup_data["name"],
            "analysis": analysis,
            "aggregate_scores": aggregated_feedback["scores"],
            "detailed_feedback": aggregated_feedback["feedback"]
        }
    
    def _aggregate_feedback(self, judge_feedback: List[Dict]) -> Dict:
        """
        Aggregate scores and feedback from multiple judges
        """
        df = pd.DataFrame(judge_feedback)
        
        # Calculate normalized scores
        score_columns = [col for col in df.columns if col.startswith('score_')]
        normalized_scores = {}
        
        for col in score_columns:
            scores = df[col].values
            normalized = (scores - scores.mean()) / scores.std()
            normalized_scores[col] = normalized.mean()
        
        written_feedback = df['feedback'].tolist()

        return {
            "scores": normalized_scores,
            "feedback": written_feedback
        }
    
    def _create_analysis_prompt(self, startup_data: Dict, aggregated_feedback: Dict) -> str:
        """
        Create a prompt for Groq to analyze the feedback
        """
        prompt = f"""
        Please analyze the following judge feedback for {startup_data['name']}:
        
        Normalized Scores:
        {json.dumps(aggregated_feedback['scores'], indent=2)}
        
        Judge Feedback:
        {json.dumps(aggregated_feedback['feedback'], indent=2)}
        
        Provide a comprehensive analysis of the startup's strengths and weaknesses, 
        including any key trends, insights, and recommendations for improvement.
        """
        return prompt
    
    def _structure_response(self, response_content: str) -> str:
        """
        Structure the response content from Groq to fit the desired output format
        """
        # Here you can modify the response structure depending on Groq's output format
        return response_content.strip()

# Example usage:
api_key = os.getenv("GROQ_API_KEY")
feedback_processor = FeedbackProcessor(api_key)

# Example data (this would typically come from your database or user input)
startup_data = {"name": "Tech Startup XYZ"}
judge_feedback = [
    {"score_problem": 4, "score_solution": 3, "score_communication": 5, "feedback": "Great idea, but execution needs work."},
    {"score_problem": 5, "score_solution": 4, "score_communication": 4, "feedback": "Strong solution but unclear market fit."},
    # Add more judge feedback here...
]

result = feedback_processor.process_startup_feedback(startup_data, judge_feedback)
print(json.dumps(result, indent=2))
