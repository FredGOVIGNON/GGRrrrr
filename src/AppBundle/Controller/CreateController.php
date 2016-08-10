<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Form\ChallengeType;
use AppBundle\Entity\Challenge;
use Symfony\Component\HttpFoundation\Session\Session;

class CreateController extends Controller
{
    /**
     * @Route("/create", name="create")
     */
    public function indexAction(Request $request)
    {

        $challenge = new Challenge();
        $form = $this->createForm('AppBundle\Form\ChallengeType', $challenge);
        $form->handleRequest($request);
        
        $em = $this->getDoctrine()->getManager();

        if ($form->isSubmitted() && $form->isValid()) {
            // dump($request);exit;

            $user = $this->getUser();
            // dump($user);exit;

            $coordRoundOne = $request->request->get('RoundOne');
            $coordRoundTwo = $request->request->get('RoundTwo');
            $coordRoundThree = $request->request->get('RoundThree');
            $coordRoundFour = $request->request->get('RoundFour');
            $coordRoundFive = $request->request->get('RoundFive');

            $coords = $coordRoundOne.";".$coordRoundTwo.";".$coordRoundThree.";".$coordRoundFour.";".$coordRoundFive;

            $challenge->setCoords($coords);
            $challenge->setCreator($user);

            $em->persist($challenge);
            $em->flush();

            return $this->render('default/index.html.twig');
        }

        return $this->render('default/create.html.twig', array(
            'form' => $form->createView(),
        ));
    }
    /**
     * Deletes a challenge.
     *
     * @Route("/challenge/{id}", options = { "expose" = true }, name="challenge_delete")
     */
    public function deleteAction(Request $request, Challenge $challenge)
    {
        $em = $this->getDoctrine()->getManager();
        $session = new Session();

        $zechallenge = $em->getRepository('AppBundle:Challenge')->findOneById($challenge);
        $scores = $em->getRepository('AppBundle:Score')->findByIdChallenge($zechallenge);
        $votes = $em->getRepository('AppBundle:Vote')->findByChallengeId($zechallenge);

        foreach ($votes as $vote) {
            $em->remove($vote);
        }

        foreach ($scores as $score) {
            $em->remove($score);
        }
        
        $em->remove($challenge);
        $em->flush();

        $session->getFlashBag()->add('infos', $this->get('translator')->trans('Challenge Deleted'));

        return $this->redirectToRoute('challengelist');
    }
}
